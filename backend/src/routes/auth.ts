import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { hashPassword, comparePassword, generateToken } from "../lib/auth";
import { authenticate, AuthRequest } from "../middleware/auth";
import { upload } from "../lib/multer";
import cloudinary from "../lib/cloudinary";
import passport from "../lib/passport";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../lib/email";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Bu mail zaten kayıtlı (LOG_400)" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);

    // Hoş geldin maili gönder (async, yanıtı bekletmez)
    sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error("Welcome email error:", err),
    );
  } catch (error) {
    res.status(500).json({ error: "Kayıt başarısız oldu (LOG_500)" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Kullanıcı adı veya şifre hatalı (USR_401)" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error:
          "Hesabınız aktif değil. Lütfen yönetici ekibi ile iletişime geçin. (USR_403)",
      });
    }

    if (!user.hashedPassword) {
      return res.status(401).json({
        error:
          "Bu hesap OAuth ile oluşturulmuş. Lütfen OAuth ile giriş yapın. (USR_401)",
      });
    }

    const isValid = await comparePassword(password, user.hashedPassword);
    if (!isValid) {
      return res
        .status(401)
        .json({ error: "Kullanıcı adı veya şifre hatalı (USR_401)" });
    }

    const token = generateToken(user.id);

    res.json({
      access_token: token,
      token_type: "bearer",
    });
  } catch (error) {
    res.status(500).json({ error: "Login Failed (LOG_505)" });
  }
});

// Get current user
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        payments: {
          where: { isSuccessful: true },
          include: {
            course: {
              include: {
                sections: {
                  include: {
                    videos: true,
                  },
                },
              },
            },
          },
        },
        certificates: true,
        videoProgress: {
          where: { status: "completed" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı Bulunamadı (USR_404)" });
    }

    const activePayments = user.payments.filter(
      (payment) => payment.course?.status === "ACTIVE",
    );

    const courses = activePayments.map((payment) => {
      const course = payment.course;

      const courseVideoIds = course?.sections.flatMap((section) =>
        section.videos.map((video) => video.id),
      );

      const completedVideos = user.videoProgress.filter((vp) =>
        courseVideoIds?.includes(vp.videoId),
      );

      const totalVideos = courseVideoIds?.length || 0;
      const completedCount = completedVideos.length;

      const lastActivityDate =
        completedVideos.length > 0
          ? Math.max(
              ...completedVideos.map((v) => v.completedAt?.getTime() || 0),
            )
          : payment.createdAt.getTime();

      return {
        id: payment.courseId,
        date: lastActivityDate,
        progressPercentage:
          totalVideos > 0
            ? Math.round((completedCount / totalVideos) * 100)
            : 0,
        completedVideos: completedVideos.map((v) => v.videoId),
        quizScore: undefined,
        quizCompleted: false,
      };
    });

    const completedCourses = courses.filter(
      (c) => c.progressPercentage === 100,
    ).length;
    const ongoingCourses = courses.filter(
      (c) => c.progressPercentage > 0 && c.progressPercentage < 100,
    ).length;

    const profileData = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      photo: user.avatar || undefined,
      phone: user.phone || undefined,
      registeredBy: user.createdAt.toISOString().split("T")[0],
      registeredCourses: activePayments.map((p) => p.courseId),
      statics: {
        completedCourses,
        ongoingCourses,
        totalHours: 0, // Could be calculated from course durations
      },
      courses,
      certificates: user.certificates.map((cert) => {
        const course = user.payments.find(
          (p) => p.courseId === cert.courseId,
        )?.course;
        return {
          id: cert.certificateId,
          courseId: cert.courseId,
          courseTitle: course?.title || "Bilinmeyen Kurs",
          issueDate: cert.createdAt,
          type: "completion" as const,
        };
      }),
    };

    res.json(profileData);
  } catch (error) {
    res.status(500).json({ error: "Kullanıcı Bilgileri Alınamadı (USR_500)" });
  }
});

router.put("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(avatar !== undefined && { avatar }),
      },
      include: {
        payments: {
          where: { isSuccessful: true },
          include: {
            course: {
              include: {
                sections: {
                  include: {
                    videos: true,
                  },
                },
              },
            },
          },
        },
        certificates: true,
        videoProgress: {
          where: { status: "completed" },
        },
      },
    });

    const activePayments = user.payments.filter(
      (payment) => payment.course?.status === "ACTIVE",
    );

    const courses = activePayments.map((payment) => {
      const course = payment.course;

      const courseVideoIds = course?.sections.flatMap((section) =>
        section.videos.map((video) => video.id),
      );

      const completedVideos = user.videoProgress.filter((vp) =>
        courseVideoIds?.includes(vp.videoId),
      );

      const totalVideos = courseVideoIds?.length || 0;
      const completedCount = completedVideos.length;

      const lastActivityDate =
        completedVideos.length > 0
          ? Math.max(
              ...completedVideos.map((v) => v.completedAt?.getTime() || 0),
            )
          : payment.createdAt.getTime();

      return {
        id: payment.courseId,
        date: lastActivityDate,
        progressPercentage:
          totalVideos > 0
            ? Math.round((completedCount / totalVideos) * 100)
            : 0,
        completedVideos: completedVideos.map((v) => v.videoId),
        quizScore: undefined,
        quizCompleted: false,
      };
    });

    const completedCourses = courses.filter(
      (c) => c.progressPercentage === 100,
    ).length;
    const ongoingCourses = courses.filter(
      (c) => c.progressPercentage > 0 && c.progressPercentage < 100,
    ).length;

    const profileData = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      photo: user.avatar || undefined,
      phone: user.phone || undefined,
      registeredBy: user.createdAt.toISOString().split("T")[0],
      registeredCourses: activePayments.map((p) => p.courseId),
      statics: {
        completedCourses,
        ongoingCourses,
        totalHours: 0,
      },
      courses,
      certificates: user.certificates.map((cert) => {
        const course = user.payments.find(
          (p) => p.courseId === cert.courseId,
        )?.course;
        return {
          id: cert.certificateId,
          courseId: cert.courseId,
          courseTitle: course?.title || "Bilinmeyen Kurs",
          issueDate: cert.createdAt,
          type: "completion" as const,
        };
      }),
    };

    res.json(profileData);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Kullanıcı Güncellenemedi (USR_500)" });
  }
});

router.get(
  "/users/recent",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: { isAdmin: true },
      });

      if (!user?.isAdmin) {
        return res
          .status(403)
          .json({ error: "Admin yetkisi gerekli (ADM_403)" });
      }

      const recentUsers = await prisma.user.findMany({
        take: 15, // Son 15 kullanıcı
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          payments: {
            include: {
              course: {
                select: {
                  title: true,
                  price: true,
                },
              },
            },
          },
        },
      });

      const formattedUsers = recentUsers.map((u) => {
        const enrolledCourses = u.payments.map((p) => ({
          id: p.courseId,
          title: p.course?.title,
          price: p.course?.price,
        }));

        // Eğer ödeme yapmışsa paket adı, yoksa Ücretsiz
        const plan = u.payments.length > 0 ? u.payments.length : 0;

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          plan,
          joinDate: u.createdAt,
          spending: u.payments.reduce(
            (sum, p) => sum + (p?.course?.price || 0),
            0,
          ),
          courses: enrolledCourses,
        };
      });

      res.json(formattedUsers);
    } catch (error) {
      res.status(500).json({ error: "Son Kullanıcılar Alınamadı (USR_500)" });
    }
  },
);

router.post(
  "/change-password",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
      });

      if (!user) {
        return res
          .status(404)
          .json({ error: "Kullanıcı bulunamadı (USR_404)" });
      }

      if (!user.hashedPassword) {
        return res.status(400).json({
          error:
            "Bu hesap OAuth ile oluşturulmuş. Önce bir şifre belirleyin. (USR_400)",
        });
      }

      const isValid = await comparePassword(
        currentPassword,
        user.hashedPassword,
      );
      if (!isValid) {
        return res.status(401).json({ error: "Mevcut şifre yanlış (USR_401)" });
      }

      const hashedPassword = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { hashedPassword },
      });

      res.json({ message: "Şifre başarıyla güncellendi (USR_200)" });
    } catch (error) {
      res.status(500).json({ error: "Şifre güncellenemedi (USR_500)" });
    }
  },
);

// Upload avatar
router.post(
  "/upload-avatar",
  authenticate,
  upload.single("avatar"),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Dosya yüklenmedi (USR_400)" });
      }

      // Convert buffer to base64 data URI
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "mo-academy/avatars",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      res.json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error: any) {
      if (error.message && error.message.includes("dosya")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Dosya yüklenemedi (USR_500)" });
    }
  },
);

// ============ OAuth Routes ============

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth/signin?error=google_auth_failed`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = generateToken(user.id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  },
);

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth/signin?error=github_auth_failed`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = generateToken(user.id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  },
);

// Facebook OAuth
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"], session: false }),
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=facebook_auth_failed`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = generateToken(user.id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  },
);

// LinkedIn OAuth
router.get("/linkedin", passport.authenticate("linkedin", { session: false }));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=linkedin_auth_failed`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = generateToken(user.id);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  },
);

// ============ Account Linking Routes (for authenticated users) ============

// Get linked accounts
router.get(
  "/linked-accounts",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const accounts = await prisma.oAuthAccount.findMany({
        where: { userId: req.user!.id },
        select: {
          id: true,
          provider: true,
          createdAt: true,
        },
      });

      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Bağlı hesaplar alınamadı (OAUTH_500)" });
    }
  },
);

// Unlink account
router.delete(
  "/unlink/:provider",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { provider } = req.params as { provider: string };

      // Check if user has a password (can't remove all OAuth if no password)
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        include: {
          accounts: true,
        },
      });

      if (!user) {
        return res
          .status(404)
          .json({ error: "Kullanıcı bulunamadı (USR_404)" });
      }

      // If user has no password and only one OAuth account, don't allow removal
      if (!user.hashedPassword && user.accounts.length === 1) {
        return res.status(400).json({
          error:
            "En az bir giriş yöntemi olmalı. Önce şifre belirleyin. (OAUTH_400)",
        });
      }

      // Delete the OAuth account
      await prisma.oAuthAccount.deleteMany({
        where: {
          userId: req.user!.id,
          provider,
        },
      });

      res.json({ message: "Hesap bağlantısı kaldırıldı (OAUTH_200)" });
    } catch (error) {
      res.status(500).json({ error: "Hesap bağı kaldırılamadı (OAUTH_500)" });
    }
  },
);

// Link Google account
router.get(
  "/link/google",
  authenticate,
  (req: AuthRequest, res: Response, next: any) => {
    // Store user ID in session for linking
    const state = Buffer.from(
      JSON.stringify({ userId: req.user!.id }),
    ).toString("base64");
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
      state,
    })(req, res, next);
  },
);

router.get(
  "/link/google/callback",
  passport.authenticate("google", { session: false, failWithError: true }),
  async (req: Request, res: Response) => {
    try {
      const state = req.query.state as string;
      // Verify JWT token from state
      const decoded = jwt.verify(state, process.env.JWT_SECRET!) as {
        userId: number;
      };
      const userId = decoded.userId;
      const oauthUser = req.user as any;

      // Check if this OAuth account is already linked to another user
      const existingAccount = await prisma.oAuthAccount.findUnique({
        where: {
          provider_providerId: {
            provider: "google",
            providerId: oauthUser.id || oauthUser.providerId,
          },
        },
      });

      if (existingAccount && existingAccount.userId !== userId) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/profile?error=account_already_linked`,
        );
      }

      if (!existingAccount) {
        // Link the account
        await prisma.oAuthAccount.create({
          data: {
            userId,
            provider: "google",
            providerId: oauthUser.id || oauthUser.providerId,
          },
        });
      }

      res.redirect(
        `${process.env.FRONTEND_URL}/profile?success=account_linked`,
      );
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/profile?error=link_failed`);
    }
  },
);

// Link GitHub account
router.get(
  "/link/github",
  authenticate,
  (req: AuthRequest, res: Response, next: any) => {
    const state = Buffer.from(
      JSON.stringify({ userId: req.user!.id }),
    ).toString("base64");
    passport.authenticate("github", {
      scope: ["user:email"],
      session: false,
      state,
    })(req, res, next);
  },
);

router.get(
  "/link/github/callback",
  passport.authenticate("github", { session: false, failWithError: true }),
  async (req: Request, res: Response) => {
    try {
      const state = req.query.state as string;
      const decoded = jwt.verify(state, process.env.JWT_SECRET!) as {
        userId: number;
      };
      const userId = decoded.userId;
      const oauthUser = req.user as any;

      const existingAccount = await prisma.oAuthAccount.findUnique({
        where: {
          provider_providerId: {
            provider: "github",
            providerId: oauthUser.id || oauthUser.providerId,
          },
        },
      });

      if (existingAccount && existingAccount.userId !== userId) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/profile?error=account_already_linked`,
        );
      }

      if (!existingAccount) {
        await prisma.oAuthAccount.create({
          data: {
            userId,
            provider: "github",
            providerId: oauthUser.id || oauthUser.providerId,
          },
        });
      }

      res.redirect(
        `${process.env.FRONTEND_URL}/profile?success=account_linked`,
      );
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/profile?error=link_failed`);
    }
  },
);

// Link Facebook account
router.get(
  "/link/facebook",
  authenticate,
  (req: AuthRequest, res: Response, next: any) => {
    const state = Buffer.from(
      JSON.stringify({ userId: req.user!.id }),
    ).toString("base64");
    passport.authenticate("facebook", {
      scope: ["email"],
      session: false,
      state,
    })(req, res, next);
  },
);

router.get(
  "/link/facebook/callback",
  passport.authenticate("facebook", { session: false, failWithError: true }),
  async (req: Request, res: Response) => {
    try {
      const state = req.query.state as string;
      const decoded = jwt.verify(state, process.env.JWT_SECRET!) as {
        userId: number;
      };
      const userId = decoded.userId;
      const oauthUser = req.user as any;

      const existingAccount = await prisma.oAuthAccount.findUnique({
        where: {
          provider_providerId: {
            provider: "facebook",
            providerId: oauthUser.id || oauthUser.providerId,
          },
        },
      });

      if (existingAccount && existingAccount.userId !== userId) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/profile?error=account_already_linked`,
        );
      }

      if (!existingAccount) {
        await prisma.oAuthAccount.create({
          data: {
            userId,
            provider: "facebook",
            providerId: oauthUser.id || oauthUser.providerId,
          },
        });
      }

      res.redirect(
        `${process.env.FRONTEND_URL}/profile?success=account_linked`,
      );
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/profile?error=link_failed`);
    }
  },
);

// Link LinkedIn account
router.get(
  "/link/linkedin",
  authenticate,
  (req: AuthRequest, res: Response, next: any) => {
    const state = Buffer.from(
      JSON.stringify({ userId: req.user!.id }),
    ).toString("base64");
    passport.authenticate("linkedin", {
      session: false,
      state,
    })(req, res, next);
  },
);

router.get(
  "/link/linkedin/callback",
  passport.authenticate("linkedin", { session: false, failWithError: true }),
  async (req: Request, res: Response) => {
    try {
      const state = req.query.state as string;
      const decoded = jwt.verify(state, process.env.JWT_SECRET!) as {
        userId: number;
      };
      const userId = decoded.userId;
      const oauthUser = req.user as any;

      const existingAccount = await prisma.oAuthAccount.findUnique({
        where: {
          provider_providerId: {
            provider: "linkedin",
            providerId: oauthUser.id || oauthUser.providerId,
          },
        },
      });

      if (existingAccount && existingAccount.userId !== userId) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/profile?error=account_already_linked`,
        );
      }

      if (!existingAccount) {
        await prisma.oAuthAccount.create({
          data: {
            userId,
            provider: "linkedin",
            providerId: oauthUser.id || oauthUser.providerId,
          },
        });
      }

      res.redirect(
        `${process.env.FRONTEND_URL}/profile?success=account_linked`,
      );
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/profile?error=link_failed`);
    }
  },
);

// ============ Şifre Sıfırlama ============

// Şifre sıfırlama talebi
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email zorunludur" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Kullanıcı yoksa da aynı yanıtı ver (güvenlik)
    if (!user || !user.hashedPassword) {
      return res.json({
        message: "Eğer bu mail kayıtlıysa sıfırlama linki gönderildi",
      });
    }

    // Eski token'ları sil
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    // Yeni token oluştur
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    await sendPasswordResetEmail(user.email, user.name, token);

    res.json({ message: "Eğer bu mail kayıtlıysa sıfırlama linki gönderildi" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "İşlem başarısız" });
  }
});

// Şifreyi sıfırla
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token ve yeni şifre zorunludur" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Şifre en az 6 karakter olmalıdır" });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ error: "Geçersiz veya süresi dolmuş token" });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { hashedPassword },
    });

    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    res.json({ message: "Şifre başarıyla sıfırlandı" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "İşlem başarısız" });
  }
});

export default router;
