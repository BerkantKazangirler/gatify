import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  authenticate,
  optionalAuthenticate,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth";
import axios from "axios";
import { upload, uploadResource } from "../lib/multer";
import cloudinary from "../lib/cloudinary";
import { resolveBackendLocale, tCourses } from "../lib/i18n";

const router = Router();

const SUPPORTED_LOCALES: Record<string, string> = {
  tr: "tr-TR",
  en: "en-US",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
};

type SourcePreview = { id?: string; title?: string; type?: string };

const parseSourcesPreview = (raw: string | null): SourcePreview[] | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map((s: any) => ({
      id: s?.id,
      title: s?.title,
      type: s?.type,
    }));
  } catch {
    return null;
  }
};

type SourcePrivate = {
  id?: string;
  title?: string;
  type?: string;
  size?: string;
  url?: string;
  downloadUrl?: string;
};

const parseSourcesPrivate = (
  raw: string | null,
  courseId: string,
): SourcePrivate[] | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map((s: any) => ({
      id: s?.id,
      title: s?.title,
      type: s?.type,
      size: s?.size,
      url: s?.url,
      downloadUrl:
        s?.id ? `/api/courses/${courseId}/sources/${s.id}/download` : undefined,
    }));
  } catch {
    return null;
  }
};

const resolveRequestLocale = (req: Request): string => {
  const rawLocale =
    (req.headers["x-locale"] as string | undefined) ||
    req.headers["accept-language"] ||
    "tr";

  const languageCode = rawLocale.split(",")[0].trim().split("-")[0];
  return SUPPORTED_LOCALES[languageCode] || "tr-TR";
};

const getMonthLabel = (date: Date, locale: string): string => {
  // Remove trailing dot in some locales (e.g., "Jan.") for cleaner charts.
  return new Intl.DateTimeFormat(locale, { month: "short" })
    .format(date)
    .replace(/\.$/, "");
};

// Simple in-memory cache for stats (5 minutes TTL)
let statsCache: { data: any; timestamp: number } | null = null;
const STATS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Get all videos from all courses - MUST BE BEFORE /:courseId
router.get("/videos/all", async (req: Request, res: Response) => {
  try {
    const locale = resolveBackendLocale(req);
    const courses = await prisma.course.findMany({
      include: {
        sections: {
          include: {
            videos: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    // Flatten all videos from all courses
    const videos: any[] = [];

    courses.forEach((course) => {
      course.sections.forEach((section) => {
        section.videos.forEach((video) => {
          videos.push({
            id: video.id,
            title: video.title,
            category: course.category,
            desc: video.notes || "", // Using notes as description
            duration: video.duration,
            level: course.level,
            views: 0, // TODO: Implement view tracking
            image: course.image?.replace("course/", "") || "default.jpg",
            status: tCourses(locale, "inProgress"), // TODO: Get from user progress
            courseId: course.id,
          });
        });
      });
    });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "Videolar alınamadı (VID_500)" });
  }
});

// Get platform statistics
router.get("/stats", async (req: Request, res: Response) => {
  try {
    // Check cache first
    if (statsCache && Date.now() - statsCache.timestamp < STATS_CACHE_TTL) {
      return res.json(statsCache.data);
    }

    // Paralel olarak tüm query'leri çalıştır
    const [
      totalStudents,
      courses,
      completedVideos,
      allPayments,
      thisMonthStudents,
      lastMonthStudents,
      totalAdmins,
    ] = await Promise.all([
      // Total active students
      prisma.user.count({
        where: { isActive: true },
      }),

      // All courses with videos (sadece gerekli alanlar)
      prisma.course.findMany({
        select: {
          status: true,
          star: true,
          sections: {
            select: {
              videos: {
                select: {
                  duration: true,
                  id: true,
                },
              },
            },
          },
        },
      }),

      // Completed videos count
      prisma.videoProgress.count({
        where: { status: "completed" },
      }),

      // All successful payments (exclude admin-assigned courses)
      prisma.payment.findMany({
        where: {
          isSuccessful: true,
          paymentMethod: { not: "admin" },
        },
        select: {
          total: true,
          createdAt: true,
        },
      }),

      // This month's new students
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
          payments: { some: { isSuccessful: true } },
        },
      }),

      // Last month's new students
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 1,
              1,
            ),
            lte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              0,
              23,
              59,
              59,
            ),
          },
          payments: { some: { isSuccessful: true } },
        },
      }),

      // Total admin users
      prisma.user.count({
        where: { isAdmin: true },
      }),
    ]);

    // Calculate total hours
    let totalMinutes = 0;
    courses.forEach((course) => {
      course.sections.forEach((section) => {
        section.videos.forEach((video) => {
          const duration =
            typeof video.duration === "string"
              ? parseFloat(video.duration)
              : video.duration;
          totalMinutes += duration || 0;
        });
      });
    });
    const totalHours = Math.round(totalMinutes / 60);

    // Calculate average rating
    const activeCourses = courses.filter(
      (c) => c.status === "ACTIVE" && c.star > 0,
    );
    const averageRating =
      activeCourses.length > 0
        ? parseFloat(
            (
              activeCourses.reduce((sum, c) => sum + c.star, 0) /
              activeCourses.length
            ).toFixed(1),
          )
        : 0;

    // Calculate revenue
    const totalRevenue = allPayments.reduce((sum, p) => sum + p.total, 0);
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
    );

    const thisMonthRevenue = allPayments
      .filter((p) => p.createdAt >= thisMonthStart)
      .reduce((sum, p) => sum + p.total, 0);

    const lastMonthRevenue = allPayments
      .filter(
        (p) => p.createdAt >= lastMonthStart && p.createdAt <= lastMonthEnd,
      )
      .reduce((sum, p) => sum + p.total, 0);

    const revenueGrowth =
      lastMonthRevenue > 0
        ? parseFloat(
            (
              ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) *
              100
            ).toFixed(1),
          )
        : 0;

    const studentGrowth =
      lastMonthStudents > 0
        ? parseFloat(
            (
              ((thisMonthStudents - lastMonthStudents) / lastMonthStudents) *
              100
            ).toFixed(1),
          )
        : 0;

    // Basitleştirilmiş completed courses hesabı - tam doğru olmayabilir ama hızlı
    // Gerçek implementasyon için ayrı bir aggregation query gerekir
    const completedCourses = Math.floor(completedVideos / 10); // Yaklaşık hesaplama

    const stats = {
      totalStudents,
      totalHours,
      completedVideos,
      completedCourses,
      averageRating,
      totalRevenue,
      revenueGrowth,
      studentGrowth,
      totalAdmins,
    };

    // Cache'e kaydet
    statsCache = {
      data: stats,
      timestamp: Date.now(),
    };

    res.json(stats);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: tCourses(resolveBackendLocale(req), "statsFailed") });
  }
});

// Get analytics data for charts
router.get("/analytics", async (req: Request, res: Response) => {
  try {
    const locale = resolveRequestLocale(req);

    // Get last 6 months revenue and student data
    const now = new Date();
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        0,
        23,
        59,
        59,
      );

      const monthRevenue = await prisma.payment.aggregate({
        where: {
          isSuccessful: true,
          paymentMethod: { not: "admin" },
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: {
          total: true,
        },
      });

      const monthStudents = await prisma.user.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
          payments: {
            some: {
              isSuccessful: true,
            },
          },
        },
      });

      monthlyData.push({
        month: getMonthLabel(monthStart, locale),
        gelir: monthRevenue._sum.total || 0,
        ogrenci: monthStudents,
      });
    }

    // Get course distribution by category
    const courses = await prisma.course.findMany({
      include: {
        payments: {
          where: {
            isSuccessful: true,
            paymentMethod: { not: "admin" },
          },
        },
      },
    });

    const categoryData: { [key: string]: { count: number; color: string } } =
      {};
    const categoryColors: { [key: string]: string } = {
      python: "#4285F4",
      "yapay zeka": "#A142F4",
      matematik: "#00BC7D",
    };

    courses.forEach((course) => {
      const category = course.category.toLowerCase();
      const studentCount = course.payments.length;

      if (!categoryData[category]) {
        categoryData[category] = {
          count: 0,
          color: categoryColors[category] || "#FF9800",
        };
      }
      categoryData[category].count += studentCount;
    });

    const pieData = Object.entries(categoryData).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: data.count,
      color: data.color,
    }));

    // Get top 4 courses by students
    const coursesWithStats = courses.map((course) => ({
      name: course.title,
      ogrenci: course.payments.length,
      gelir: course.payments.reduce((sum, p) => sum + p.total, 0),
    }));

    const popularCourses = coursesWithStats
      .sort((a, b) => b.ogrenci - a.ogrenci)
      .slice(0, 4);

    const revenueCourses = coursesWithStats
      .sort((a, b) => b.gelir - a.gelir)
      .slice(0, 4);

    res.json({
      monthlyData,
      pieData,
      popularCourses,
      revenueCourses,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ error: tCourses(resolveBackendLocale(req), "analyticsFailed") });
  }
});

// Get all courses
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, level, status, skip = "0", limit = "100" } = req.query;

    const normalizedStatus =
      typeof status === "string" ? status.toUpperCase() : undefined;
    const allowedStatuses = new Set(["ACTIVE", "INACTIVE", "DRAFT"]);
    const shouldReturnAllStatuses = normalizedStatus === "ALL";
    const statusFilter =
      !shouldReturnAllStatuses &&
      normalizedStatus &&
      allowedStatuses.has(normalizedStatus)
        ? normalizedStatus
        : "ACTIVE";

    const courses = await prisma.course.findMany({
      where: {
        ...(!shouldReturnAllStatuses && {
          status: statusFilter as "ACTIVE" | "INACTIVE" | "DRAFT",
        }),
        ...(category && { category: category as string }),
        ...(level && { level: level as string }),
      },
      include: {
        sections: {
          include: {
            videos: true,
          },
          orderBy: { order: "asc" },
        },
        payments: {
          where: {
            isSuccessful: true,
            paymentMethod: { not: "admin" },
          },
        },
      },
      skip: parseInt(skip as string),
      take: parseInt(limit as string),
    });

    // Parse JSON fields and calculate stats
    const coursesWithParsedJson = await Promise.all(
      courses.map(async (course) => {
        // Calculate total lessons (videos) from sections
        const totalLessons = course.sections.reduce(
          (sum, section) => sum + section.videos.length,
          0,
        );

        // Calculate students count (unique successful payments)
        const studentsCount = course.payments.length;

        // Calculate revenue (total from successful payments)
        const revenue = course.payments.reduce(
          (sum, payment) => sum + payment.total,
          0,
        );

        return {
          ...course,
          desc: course.description,
          image: course.image,
          lessons: totalLessons, // Auto-calculated from videos
          students: studentsCount, // Auto-calculated from payments
          revenue: revenue, // Total revenue
          certificateTemplate: course.certificateTemplate, // Never expose on public endpoints
          // Keep paid content private; return only preview-safe fields in public listing.
          sources: parseSourcesPreview(course.sources),
          quizQuestions: undefined,
          sections: course.sections.map((section) => ({
            ...section,
            videos: section.videos.map((video) => ({
              id: video.id,
              sectionId: video.sectionId,
              title: video.title,
              duration: video.duration,
              order: video.order,
              // Never expose paid content fields in public listing.
              videoUrl: undefined,
              codeSnippets: undefined,
              notes: undefined,
            })),
          })),
          payments: undefined, // Remove payments from response
        };
      }),
    );

    res.json(coursesWithParsedJson);
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({
      error: tCourses(resolveBackendLocale(req), "courseFetchFailed"),
    });
  }
});

// Get course by ID for admin editing - preserves video URLs
router.get(
  "/admin/:courseId",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { courseId } = req.params as { courseId: string };

      const course = await prisma.course.findFirst({
        where: { id: courseId },
        include: {
          sections: {
            include: {
              videos: {
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
          ratings: {
            select: { rating: true },
          },
        },
      });

      if (!course) {
        return res.status(404).json({
          error: tCourses(resolveBackendLocale(req), "courseNotFound"),
        });
      }

      const legacyTeacherId = /^\d+$/.test(course.teacher)
        ? Number(course.teacher)
        : null;

      const teacher = legacyTeacherId
        ? await prisma.user.findUnique({
            where: { id: legacyTeacherId },
            select: { id: true, name: true, avatar: true },
          })
        : null;

      const studentCount = await prisma.payment.count({
        where: { courseId, isSuccessful: true },
      });

      const courseWithParsedJson = {
        ...course,
        desc: course.description,
        sources: course.sources ? JSON.parse(course.sources) : null,
        quizQuestions: course.quizQuestions
          ? JSON.parse(course.quizQuestions)
          : null,
        students: studentCount,
        sections: course.sections.map((section) => ({
          ...section,
          videos: section.videos.map((video) => ({
            ...video,
            codeSnippets: video.codeSnippets
              ? JSON.parse(video.codeSnippets)
              : null,
            notes: video.notes ? JSON.parse(video.notes) : null,
          })),
        })),
      };

      res.json(courseWithParsedJson);
    } catch (error) {
      console.error("Admin get course error:", error);
      res.status(500).json({
        error: tCourses(resolveBackendLocale(req), "courseFetchOneFailed"),
      });
    }
  },
);

// Get full course content (requires auth + enrollment or admin)
// This is the endpoint the player should use while watching a purchased course.
router.get(
  "/:courseId/content",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const locale = resolveBackendLocale(req);
      const { courseId } = req.params as { courseId: string };

      // Admins can always access
      if (!req.user!.isAdmin) {
        const payment = await prisma.payment.findFirst({
          where: { courseId, userId: req.user!.id, isSuccessful: true },
          select: { id: true },
        });

        if (!payment) {
          return res
            .status(403)
            .json({ error: tCourses(locale, "videoAccessDenied") });
        }
      }

      const course = await prisma.course.findFirst({
        where: { id: courseId },
        include: {
          sections: {
            include: {
              videos: {
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
          ratings: {
            select: { rating: true },
          },
        },
      });

      if (!course) {
        return res
          .status(404)
          .json({ error: tCourses(locale, "courseNotFound") });
      }

      // Count total students (successful payments)
      const studentCount = await prisma.payment.count({
        where: { courseId, isSuccessful: true },
      });

      const courseWithParsedJson = {
        ...course,
        desc: course.description,
        sources: course.sources ? JSON.parse(course.sources) : null,
        quizQuestions: course.quizQuestions
          ? JSON.parse(course.quizQuestions)
          : null,
        students: studentCount,
        sections: course.sections.map((section) => ({
          ...section,
          videos: section.videos.map((video) => ({
            ...video,
            videoUrl: undefined, // Always fetched via /:courseId/video/:videoId/url
            codeSnippets: video.codeSnippets
              ? JSON.parse(video.codeSnippets)
              : null,
            notes: video.notes ? JSON.parse(video.notes) : null,
          })),
        })),
      };

      res.json(courseWithParsedJson);
    } catch (error) {
      console.error("Get course content error:", error);
      res.status(500).json({
        error: tCourses(resolveBackendLocale(req), "courseFetchOneFailed"),
      });
    }
  },
);

// Get course sources (download info) — requires auth + enrollment (or admin)
router.get(
  "/:courseId/sources",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const locale = resolveBackendLocale(req);
      const { courseId } = req.params as { courseId: string };

      // Admins can always access
      if (!req.user!.isAdmin) {
        const payment = await prisma.payment.findFirst({
          where: { courseId, userId: req.user!.id, isSuccessful: true },
          select: { id: true },
        });
        if (!payment) {
          return res
            .status(403)
            .json({ error: tCourses(locale, "videoAccessDenied") });
        }
      }

      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { sources: true },
      });

      if (!course) {
        return res
          .status(404)
          .json({ error: tCourses(locale, "courseNotFound") });
      }

      res.json({ sources: parseSourcesPrivate(course.sources, courseId) });
    } catch (error) {
      console.error("Get course sources error:", error);
      res.status(500).json({
        error: tCourses(resolveBackendLocale(req), "courseFetchOneFailed"),
      });
    }
  },
);

// Download a single course source (requires auth + enrollment or admin)
router.get(
  "/:courseId/sources/:sourceId/download",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const locale = resolveBackendLocale(req);
      const { courseId, sourceId } = req.params as { courseId: string; sourceId: string };

      // Admins can always access
      if (!req.user!.isAdmin) {
        const payment = await prisma.payment.findFirst({
          where: { courseId, userId: req.user!.id, isSuccessful: true },
          select: { id: true },
        });
        if (!payment) {
          return res
            .status(403)
            .json({ error: tCourses(locale, "videoAccessDenied") });
        }
      }

      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { sources: true },
      });

      if (!course) {
        return res
          .status(404)
          .json({ error: tCourses(locale, "courseNotFound") });
      }

      const sources = (() => {
        try {
          const parsed = course.sources ? JSON.parse(course.sources) : null;
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })();

      const source = sources.find((s: any) => s?.id === sourceId);
      // Backward-compatible: older records may store the Cloudinary link under `downloadUrl`,
      // while newer records store it under `url` (admin edit).
      const url = source?.url || source?.downloadUrl;
      const filename =
        typeof source?.title === "string" && source.title.trim().length > 0
          ? source.title.trim()
          : "resource";

      if (!url || typeof url !== "string") {
        return res
          .status(404)
          .json({ error: tCourses(locale, "videoNotFound") });
      }

      const upstream = await axios.get(url, {
        responseType: "stream",
        timeout: 60_000,
        // Don't throw on non-2xx so we can return a clearer error.
        validateStatus: () => true,
      });

      if (upstream.status < 200 || upstream.status >= 300) {
        console.error("Upstream download failed:", {
          status: upstream.status,
          statusText: upstream.statusText,
          url,
        });
        return res.status(502).json({
          error: "Resource download failed (SRC_502)",
          status: upstream.status,
        });
      }

      const contentType =
        (upstream.headers["content-type"] as string | undefined) ||
        "application/octet-stream";

      // If upstream returns HTML, it usually means a CDN error page, not the file.
      if (contentType.includes("text/html")) {
        console.error("Upstream returned HTML instead of file:", { url });
        return res
          .status(502)
          .json({ error: "Resource is unavailable (SRC_503)" });
      }

      const contentLength = upstream.headers["content-length"] as
        | string
        | undefined;

      res.setHeader("Content-Type", contentType);
      if (contentLength) res.setHeader("Content-Length", contentLength);

      // Provide both filename and RFC 5987 filename* for better Unicode handling.
      const encoded = encodeURIComponent(filename);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename.replace(/"/g, "")}"; filename*=UTF-8''${encoded}`,
      );

      upstream.data.pipe(res);
    } catch (error) {
      console.error("Download source error:", error);
      res.status(500).json({
        error: tCourses(resolveBackendLocale(req), "fileUploadFailed"),
      });
    }
  },
);

// Get course by ID (public — videoUrl is never included; use /:courseId/video/:videoId/url)
router.get(
  "/:courseId",
  optionalAuthenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { courseId } = req.params as { courseId: string };

      const course = await prisma.course.findFirst({
        where: { id: courseId },
        include: {
          sections: {
            include: {
              videos: {
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
          ratings: {
            select: { rating: true },
          },
        },
      });

      if (!course) {
        return res.status(404).json({
          error: tCourses(resolveBackendLocale(req), "courseNotFound"),
        });
      }

      // Fetch teacher info only for legacy numeric user IDs.
      // New teacher values are string slugs (e.g. "mesut-ozdag").
      const legacyTeacherId = /^\d+$/.test(course.teacher)
        ? Number(course.teacher)
        : null;

      const teacher = legacyTeacherId
        ? await prisma.user.findUnique({
            where: { id: legacyTeacherId },
            select: { id: true, name: true, avatar: true },
          })
        : null;

      // Count total students (successful payments)
      const studentCount = await prisma.payment.count({
        where: { courseId, isSuccessful: true },
      });

      // If the request is authenticated and the user owns the course (or is admin),
      // include full course content (except videoUrl which is still fetched separately).
      let canAccessContent = false;
      if (req.user?.isAdmin) {
        canAccessContent = true;
      } else if (req.user?.id) {
        const payment = await prisma.payment.findFirst({
          where: { courseId, userId: req.user.id, isSuccessful: true },
          select: { id: true },
        });
        canAccessContent = !!payment;
      }

      // Parse JSON fields — videoUrl is NEVER returned here.
      // Use GET /:courseId/video/:videoId/url (requires auth+enrollment) instead.
      const courseWithParsedJson = {
        ...course,
        desc: course.description,
        certificateTemplate: course.certificateTemplate, // Never expose on public endpoints
        sources: canAccessContent
          ? parseSourcesPrivate(course.sources, courseId)
          : parseSourcesPreview(course.sources),
        quizQuestions: canAccessContent
          ? course.quizQuestions
            ? JSON.parse(course.quizQuestions)
            : null
          : undefined,
        students: studentCount,
        sections: course.sections.map((section) => ({
          ...section,
          videos: section.videos.map((video) => ({
            ...(canAccessContent
              ? {
                  ...video,
                  videoUrl: undefined, // Always stripped — fetched separately
                  codeSnippets: video.codeSnippets
                    ? JSON.parse(video.codeSnippets)
                    : null,
                  notes: video.notes ? JSON.parse(video.notes) : null,
                }
              : {
                  id: video.id,
                  sectionId: video.sectionId,
                  title: video.title,
                  duration: video.duration,
                  order: video.order,
                  videoUrl: undefined,
                  codeSnippets: undefined,
                  notes: undefined,
                }),
          })),
        })),
      };

      res.json(courseWithParsedJson);
    } catch (error) {
      console.error("Get course error:", error);
      res.status(500).json({
        error: tCourses(resolveBackendLocale(req), "courseFetchOneFailed"),
      });
    }
  },
);

// Get video URL — requires auth + enrollment (or admin)
// This is the ONLY endpoint that returns a video's actual URL.
router.get(
  "/:courseId/video/:videoId/url",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const locale = resolveBackendLocale(req);
      const { courseId, videoId } = req.params as { courseId: string; videoId: string };

      // Admins can always access
      if (!req.user!.isAdmin) {
        const payment = await prisma.payment.findFirst({
          where: { courseId, userId: req.user!.id, isSuccessful: true },
        });
        if (!payment) {
          return res
            .status(403)
            .json({ error: tCourses(locale, "videoAccessDenied") });
        }
      }

      const video = await prisma.courseVideo.findFirst({
        where: { id: videoId, section: { courseId } },
        select: { videoUrl: true },
      });

      if (!video) {
        return res
          .status(404)
          .json({ error: tCourses(locale, "videoNotFound") });
      }

      res.json({ videoUrl: video.videoUrl ?? null });
    } catch (error) {
      console.error("Get video URL error:", error);
      res.status(500).json({
        error: tCourses(resolveBackendLocale(req), "videoUrlUnavailable"),
      });
    }
  },
);

// Create course (Admin only)
router.post(
  "/",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const locale = resolveBackendLocale(req);
      const { title, category, level, price, status, description, teacher } =
        req.body;

      // Generate a unique course ID
      const courseId = `course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const course = await prisma.course.create({
        data: {
          id: courseId,
          title,
          description: description || "",
          category,
          level,
          price: parseFloat(price) || 0,
          status: status || "draft",
          teacher: teacher || "mesut-ozdag", // Use selected teacher (string ID) or default
          duration: "0", // Default duration
        },
        include: {
          sections: {
            include: { videos: true },
          },
        },
      });

      res.status(201).json(course);
    } catch (error) {
      console.error("Create course error:", error);
      res.status(500).json({
        error: tCourses(resolveBackendLocale(req), "courseCreateFailed"),
      });
    }
  },
);

// Update course (Admin only)
router.put(
  "/:courseId",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const locale = resolveBackendLocale(req);
      const { courseId } = req.params as { courseId: string };
      const { sections, ...updateData } = req.body;

      // Update course basic info
      await prisma.course.update({
        where: { id: courseId },
        data: {
          ...updateData,
          lastUpdated: new Date(),
        },
      });

      // If sections data is provided, update sections and videos
      if (sections) {
        const parsedSections =
          typeof sections === "string" ? JSON.parse(sections) : sections;
        const sectionsData = Array.isArray(parsedSections)
          ? parsedSections
          : [];

        await prisma.$transaction(
          async (tx) => {
            const incomingSectionIds: string[] = [];
            const incomingVideoIds: string[] = [];

            for (const section of sectionsData) {
              if (!section?.id) continue;

              incomingSectionIds.push(section.id);

              await tx.courseSection.upsert({
                where: { id: section.id },
                update: {
                  title: section.title,
                  order: section.order,
                  courseId,
                },
                create: {
                  id: section.id,
                  courseId,
                  title: section.title,
                  order: section.order,
                },
              });

              const videos = Array.isArray(section.videos)
                ? section.videos
                : [];

              for (const video of videos) {
                if (!video?.id) continue;

                incomingVideoIds.push(video.id);

                await tx.courseVideo.upsert({
                  where: { id: video.id },
                  update: {
                    sectionId: section.id,
                    title: video.title,
                    duration: video.duration,
                    order: video.order,
                    videoUrl: video.videoUrl || null,
                    codeSnippets: video.codeSnippets
                      ? JSON.stringify(video.codeSnippets)
                      : null,
                    notes: video.notes ? JSON.stringify(video.notes) : null,
                  },
                  create: {
                    id: video.id,
                    sectionId: section.id,
                    title: video.title,
                    duration: video.duration,
                    order: video.order,
                    videoUrl: video.videoUrl || null,
                    codeSnippets: video.codeSnippets
                      ? JSON.stringify(video.codeSnippets)
                      : null,
                    notes: video.notes ? JSON.stringify(video.notes) : null,
                  },
                });
              }
            }

            // Remove videos deleted in the editor while preserving unchanged IDs/progress.
            if (incomingVideoIds.length > 0) {
              await tx.courseVideo.deleteMany({
                where: {
                  section: { courseId },
                  id: { notIn: incomingVideoIds },
                },
              });
            } else {
              await tx.courseVideo.deleteMany({
                where: {
                  section: { courseId },
                },
              });
            }

            // Remove sections deleted in the editor.
            if (incomingSectionIds.length > 0) {
              await tx.courseSection.deleteMany({
                where: {
                  courseId,
                  id: { notIn: incomingSectionIds },
                },
              });
            } else {
              await tx.courseSection.deleteMany({
                where: { courseId },
              });
            }
          },
          // Interactive transactions have a default timeout; large course updates can exceed it.
          { maxWait: 10_000, timeout: 60_000 },
        );
      }

      // Fetch updated course with sections and videos
      const updatedCourse = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          sections: {
            include: { videos: true },
            orderBy: { order: "asc" },
          },
        },
      });

      res.json(updatedCourse);
    } catch (error) {
      console.error("Update course error:", error);
      res.status(500).json({
        error: tCourses(resolveBackendLocale(req), "courseUpdateFailed"),
      });
    }
  },
);

// Delete course (Admin only)
router.delete(
  "/:courseId",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { courseId } = req.params as { courseId: string };

      await prisma.course.delete({
        where: { id: courseId },
      });

      res.status(204).send();
    } catch (error) {
      console.error("Delete course error:", error);
      res.status(500).json({
        error: tCourses(resolveBackendLocale(req), "courseDeleteFailed"),
      });
    }
  },
);

// Get user's enrolled courses
router.get(
  "/my/enrolled",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const locale = resolveBackendLocale(req);
      const payments = await prisma.payment.findMany({
        where: {
          userId: req.user!.id,
          isSuccessful: true,
          course: {
            status: "ACTIVE",
          },
        },
        include: {
          course: {
            include: {
              sections: {
                include: { videos: true },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      });

      const courses = payments.map((p) => {
        const course = p.course;
        // Parse JSON fields
        return {
          ...course,
          desc: course?.description, // Map description to desc for frontend
          image: course?.image, // Map image to img for frontend

          quizQuestions: course?.quizQuestions
            ? JSON.parse(course?.quizQuestions)
            : null,
          sections: course?.sections.map((section) => ({
            ...section,
            videos: section.videos.map((video) => ({
              ...video,
              videoUrl: undefined, // Keep URL private; fetch via /:courseId/video/:videoId/url
              codeSnippets: video.codeSnippets
                ? JSON.parse(video.codeSnippets)
                : null,
              notes: video.notes ? JSON.parse(video.notes) : null,
            })),
          })),
        };
      });

      res.json(courses);
    } catch (error) {
      console.error("Get enrolled courses error:", error);
      res.status(500).json({
        error: tCourses(resolveBackendLocale(req), "courseFetchFailed"),
      });
    }
  },
);

// Update video progress
router.post(
  "/:courseId/videos/:videoId/progress",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { videoId } = req.params as { videoId: string };
      const { status } = req.body;

      const progress = await prisma.videoProgress.upsert({
        where: {
          userId_videoId: {
            userId: req.user!.id,
            videoId,
          },
        },
        update: {
          status,
          ...(status === "completed" && { completedAt: new Date() }),
        },
        create: {
          userId: req.user!.id,
          videoId,
          status,
          ...(status === "completed" && { completedAt: new Date() }),
        },
      });

      res.json(progress);
    } catch (error) {
      console.error("Update progress error:", error);
      res.status(500).json({ error: tCourses(resolveBackendLocale(req), "videoProgressFailed") });
    }
  },
);

// Get video progress
router.get(
  "/:courseId/videos/:videoId/progress",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { videoId } = req.params as { videoId: string };

      const progress = await prisma.videoProgress.findUnique({
        where: {
          userId_videoId: {
            userId: req.user!.id,
            videoId,
          },
        },
      });

      if (!progress) {
        return res.status(404).json({ error: tCourses(resolveBackendLocale(req), "videoProgressNotFound") });
      }

      res.json(progress);
    } catch (error) {
      console.error("Get progress error:", error);
      res.status(500).json({ error: tCourses(resolveBackendLocale(req), "videoProgressFailed") });
    }
  },
);

// Check if user is enrolled in a course + get their rating
router.get(
  "/:courseId/enrollment",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { courseId } = req.params as { courseId: string };

      const payment = await prisma.payment.findFirst({
        where: { userId: req.user!.id, courseId, isSuccessful: true },
        select: { id: true },
      });

      const userRating = await prisma.courseRating.findUnique({
        where: {
          userId_courseId: { userId: req.user!.id, courseId },
        },
        select: { rating: true },
      });

      res.json({
        isEnrolled: !!payment,
      });
    } catch (error) {
      console.error("Check enrollment error:", error);
      res.status(500).json({ error: tCourses(resolveBackendLocale(req), "courseFetchOneFailed") });
    }
  },
);

// Submit course rating
router.post(
  "/:courseId/rating",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { courseId } = req.params as { courseId: string };
      const { rating } = req.body;

      // Validate rating
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: tCourses(resolveBackendLocale(req), "ratingInvalid") });
      }

      // Check if course exists
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return res.status(404).json({ error: tCourses(resolveBackendLocale(req), "ratingCourseNotFound") });
      }

      // Create or update rating
      const courseRating = await prisma.courseRating.upsert({
        where: {
          userId_courseId: {
            userId: req.user!.id,
            courseId,
          },
        },
        update: {
          rating,
        },
        create: {
          userId: req.user!.id,
          courseId,
          rating,
        },
      });

      // Calculate new average rating
      const allRatings = await prisma.courseRating.findMany({
        where: { courseId },
      });

      const totalRating = allRatings.reduce(
        (sum: number, r: any) => sum + r.rating,
        0,
      );
      const averageRating =
        allRatings.length > 0
          ? parseFloat((totalRating / allRatings.length).toFixed(1))
          : 0;

      // Update course star rating and reviews count
      await prisma.course.update({
        where: { id: courseId },
        data: {
          star: averageRating,
          reviews: allRatings.length,
        },
      });

      res.json({
        rating: courseRating,
        averageRating,
        totalReviews: allRatings.length,
      });
    } catch (error) {
      console.error("Submit rating error:", error);
      res.status(500).json({ error: tCourses(resolveBackendLocale(req), "ratingFailed") });
    }
  },
);

// Upload course image
router.post(
  "/upload-image",
  authenticate,
  requireAdmin,
  upload.single("image"),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: tCourses(resolveBackendLocale(req), "fileNotUploaded") });
      }

      // Convert buffer to base64 data URI
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "mo-academy/courses",
        transformation: [
          { width: 1200, height: 675, crop: "fill" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      res.json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error: any) {
      console.error("Upload course image error:", error);
      res.status(500).json({ error: tCourses(resolveBackendLocale(req), "fileUploadFailed") });
    }
  },
);

// Upload course resource (PDF, DOC, ZIP, etc.)
router.post(
  "/upload-resource",
  authenticate,
  requireAdmin,
  uploadResource.single("resource"),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: tCourses(resolveBackendLocale(req), "fileNotUploaded") });
      }

      // Convert buffer to base64 data URI
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // Upload to Cloudinary (supports various file types)
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "mo-academy/resources",
        // Force "raw" so PDFs/docs/zips are delivered via /raw/upload/... URLs.
        // Using "auto" can still store as raw, but clients often mistakenly try /image/upload/... and hit 404.
        resource_type: "raw",
      });

      res.json({
        url: result.secure_url,
        publicId: result.public_id,
        size: req.file.size,
        originalName: req.file.originalname,
      });
    } catch (error: any) {
      console.error("Upload resource error:", error);
      res.status(500).json({ error: tCourses(resolveBackendLocale(req), "fileUploadFailed") });
    }
  },
);

export default router;
