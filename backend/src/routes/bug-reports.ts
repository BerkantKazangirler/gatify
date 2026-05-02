import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";
import { sendBugReplyEmail } from "../lib/email";
import { upload } from "../lib/multer";
import cloudinary from "../lib/cloudinary";

const router = Router();

// ── Public: Submit bug report ────────────────────────────────────────
router.post(
  "/",
  upload.single("screenshot"),
  async (req: Request, res: Response) => {
    try {
      const { type, page, description, reporterEmail } = req.body;

      const normalizedType = typeof type === "string" ? type.trim() : "";
      const normalizedPage = typeof page === "string" ? page.trim() : "";
      const normalizedDescription =
        typeof description === "string" ? description.trim() : "";

      if (!normalizedType || !normalizedPage || !normalizedDescription) {
        return res.status(400).json({ error: "Tüm alanlar zorunludur" });
      }

      let screenshotUrl: string | null = null;
      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const uploaded = await cloudinary.uploader.upload(dataURI, {
          folder: "mo-academy/bug-reports",
          transformation: [
            { width: 1600, height: 900, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        });

        screenshotUrl = uploaded.secure_url;
      }

      const bug = await prisma.bugReport.create({
        data: {
          type: normalizedType,
          page: normalizedPage,
          description: normalizedDescription,
          reporterEmail:
            typeof reporterEmail === "string" && reporterEmail.trim()
              ? reporterEmail.trim()
              : null,
          screenshotUrl,
        },
      });

      res.status(201).json({ success: true, id: bug.id, screenshotUrl });
    } catch (error) {
      console.error("Bug report submit error:", error);
      res.status(500).json({ error: "Hata bildirimi gonderilemedi" });
    }
  },
);

// ── Admin: Get all bug reports ───────────────────────────────────────
router.get(
  "/",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.query;
      const bugs = await prisma.bugReport.findMany({
        where: status ? { status: status as string } : undefined,
        orderBy: { createdAt: "desc" },
      });
      res.json(bugs);
    } catch (error) {
      res.status(500).json({ error: "Hata bildirimleri alınamadı" });
    }
  },
);

// ── Admin: Get single bug report ─────────────────────────────────────
router.get(
  "/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const bug = await prisma.bugReport.findUnique({
        where: { id: parseInt(req.params.id as string) },
      });
      if (!bug)
        return res.status(404).json({ error: "Hata bildirimi bulunamadı" });
      res.json(bug);
    } catch (error) {
      res.status(500).json({ error: "Hata bildirimi alınamadı" });
    }
  },
);

// ── Admin: Update status ─────────────────────────────────────────────
router.patch(
  "/:id/status",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.body;
      const validStatuses = ["open", "in-progress", "resolved", "closed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Geçersiz durum" });
      }
      const bug = await prisma.bugReport.update({
        where: { id: parseInt(req.params.id as string) },
        data: { status },
      });
      res.json(bug);
    } catch (error) {
      res.status(500).json({ error: "Durum güncellenemedi" });
    }
  },
);

// ── Admin: Reply to bug report ───────────────────────────────────────
router.post(
  "/:id/reply",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { reply } = req.body;
      if (!reply?.trim())
        return res.status(400).json({ error: "Yanıt boş olamaz" });

      const bug = await prisma.bugReport.update({
        where: { id: parseInt(req.params.id as string) },
        data: {
          adminReply: reply,
          status: "resolved",
          repliedAt: new Date(),
        },
      });

      // Send reply email if reporter provided email
      if (bug.reporterEmail) {
        sendBugReplyEmail(bug.reporterEmail, bug.page, bug.type, reply).catch(
          (e) => console.error("Bug reply email error:", e),
        );
      }

      res.json(bug);
    } catch (error) {
      res.status(500).json({ error: "Yanıt gönderilemedi" });
    }
  },
);

// ── Admin: Delete bug report ─────────────────────────────────────────
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      await prisma.bugReport.delete({
        where: { id: parseInt(req.params.id as string) },
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Hata bildirimi silinemedi" });
    }
  },
);

export default router;
