import { Router, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { sendCertificateReadyEmail } from "../lib/email";

const router = Router();

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, quizScore } = req.body;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: "Kurs bulunamadı (CK_404)" });
    }

    const existing = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: req.user!.id,
          courseId,
        },
      },
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    const certificateId = `MO-${uuidv4().substring(0, 8).toUpperCase()}`;

    const certificate = await prisma.certificate.create({
      data: {
        userId: req.user!.id,
        courseId,
        certificateId,
        studentName: user!.name,
        courseTitle: course.title,
        quizScore,
        template: course.certificateTemplate,
      },
    });

    res.status(201).json(certificate);

    // Sertifika hazır bildirim maili gönder
    sendCertificateReadyEmail(
      user!.email,
      user!.name,
      course.title,
      certificateId,
    ).catch((err) => console.error("Certificate email error:", err));
  } catch (error) {
    res.status(500).json({ error: "Sertifika oluşturulamadı (CRT_501)" });
  }
});

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.user!.id },
      include: {
        course: {
          select: {
            title: true,
            image: true,
          },
        },
      },
    });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: "Sertifikalar alınamadı (CRT_500)" });
  }
});

router.get("/:certificateId", async (req, res: Response) => {
  try {
    const { certificateId } = req.params;

    const certificate = await prisma.certificate.findUnique({
      where: { certificateId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!certificate) {
      return res.status(404).json({ error: "Sertifika bulunamadı (CRT_404)" });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ error: "Sertifika alınamadı (CRT_502)" });
  }
});

export default router;
