import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";
import { sendContactReplyEmail } from "../lib/email";

const router = Router();

// ── Public: Submit contact message ──────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, category, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Tüm alanlar zorunludur" });
    }

    const msg = await prisma.contactMessage.create({
      data: {
        name,
        email,
        category: category || "general",
        subject,
        message,
      },
    });

    res.status(201).json({ success: true, id: msg.id });
  } catch (error) {
    console.error("Contact submit error:", error);
    res.status(500).json({ error: "Mesaj gönderilemedi" });
  }
});

// ── Admin: Get all contact messages ─────────────────────────────────
router.get(
  "/",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.query;
      const messages = await prisma.contactMessage.findMany({
        where: status ? { status: status as string } : undefined,
        orderBy: { createdAt: "desc" },
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Mesajlar alınamadı" });
    }
  },
);

// ── Admin: Get single message ────────────────────────────────────────
router.get(
  "/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const msg = await prisma.contactMessage.findUnique({
        where: { id: parseInt(req.params.id as string) },
      });
      if (!msg) return res.status(404).json({ error: "Mesaj bulunamadı" });

      // Mark as read if unread
      if (msg.status === "unread") {
        await prisma.contactMessage.update({
          where: { id: msg.id },
          data: { status: "read" },
        });
      }
      res.json({
        ...msg,
        status: msg.status === "unread" ? "read" : msg.status,
      });
    } catch (error) {
      res.status(500).json({ error: "Mesaj alınamadı" });
    }
  },
);

// ── Admin: Reply to message ──────────────────────────────────────────
router.post(
  "/:id/reply",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { reply } = req.body;
      if (!reply?.trim())
        return res.status(400).json({ error: "Yanıt boş olamaz" });

      const msg = await prisma.contactMessage.update({
        where: { id: parseInt(req.params.id as string) },
        data: {
          adminReply: reply,
          status: "replied",
          repliedAt: new Date(),
        },
      });

      // Send reply email (non-blocking)
      sendContactReplyEmail(
        msg.email,
        msg.name,
        msg.subject,
        msg.message,
        reply,
      ).catch((e) => console.error("Contact reply email error:", e));

      res.json(msg);
    } catch (error) {
      res.status(500).json({ error: "Yanıt gönderilemedi" });
    }
  },
);

// ── Admin: Delete message ────────────────────────────────────────────
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      await prisma.contactMessage.delete({
        where: { id: parseInt(req.params.id as string) },
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Mesaj silinemedi" });
    }
  },
);

export default router;
