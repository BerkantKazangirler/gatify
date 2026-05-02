import { Router, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  authenticate,
  requireAdmin,
  optionalAuthenticate,
  AuthRequest,
} from "../middleware/auth";
import { sendNewsletterEmail } from "../lib/email";

const router = Router();

// ==================== ANNOUNCEMENTS ====================

// Get all announcements (public)
router.get("/announcements", async (req: Request, res: Response) => {
  try {
    const { type, limit } = req.query;

    const announcements = await prisma.announcement.findMany({
      where: type ? { type: type as string } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit as string) : undefined,
    });

    // Parse relatedLinks from JSON string
    const parsedAnnouncements = announcements.map((announcement) => ({
      ...announcement,
      relatedLinks: announcement.relatedLinks
        ? JSON.parse(announcement.relatedLinks)
        : [],
      date: announcement.createdAt.toISOString().split("T")[0],
    }));

    res.json(parsedAnnouncements);
  } catch (error) {
    console.error("Get announcements error:", error);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

// Get single announcement by ID (public)
router.get("/announcements/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    const parsedAnnouncement = {
      ...announcement,
      relatedLinks: announcement.relatedLinks
        ? JSON.parse(announcement.relatedLinks)
        : [],
      date: announcement.createdAt.toISOString().split("T")[0],
    };

    res.json(parsedAnnouncement);
  } catch (error) {
    console.error("Get announcement error:", error);
    res.status(500).json({ error: "Failed to fetch announcement" });
  }
});

// Create announcement (admin only)
router.post(
  "/announcements",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        type,
        isImportant,
        title,
        description,
        content,
        image,
        excerpt,
        teacher,
        relatedLinks,
      } = req.body;

      // Validate required fields
      if (!type || !title || !description || !content || !teacher) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const announcement = await prisma.announcement.create({
        data: {
          type,
          isImportant: isImportant || false,
          title,
          description,
          content,
          image,
          excerpt,
          teacher,
          relatedLinks: relatedLinks ? JSON.stringify(relatedLinks) : null,
        },
      });

      res.status(201).json(announcement);
    } catch (error) {
      console.error("Create announcement error:", error);
      res.status(500).json({ error: "Failed to create announcement" });
    }
  },
);

// Update announcement (admin only)
router.put(
  "/announcements/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const {
        type,
        isImportant,
        title,
        description,
        content,
        image,
        excerpt,
        teacher,
        relatedLinks,
      } = req.body;

      const announcement = await prisma.announcement.update({
        where: { id },
        data: {
          type,
          isImportant,
          title,
          description,
          content,
          image,
          excerpt,
          teacher,
          relatedLinks: relatedLinks ? JSON.stringify(relatedLinks) : null,
        },
      });

      res.json(announcement);
    } catch (error) {
      console.error("Update announcement error:", error);
      res.status(500).json({ error: "Failed to update announcement" });
    }
  },
);

// Delete announcement (admin only)
router.delete(
  "/announcements/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params as { id: string };

      await prisma.announcement.delete({
        where: { id },
      });

      res.json({ message: "Announcement deleted successfully" });
    } catch (error) {
      console.error("Delete announcement error:", error);
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  },
);

// ==================== BLOGS ====================

// Get all blogs (public, with optional auth for like status)
router.get(
  "/blogs",
  optionalAuthenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { type, limit, tag } = req.query;
      const userId = req.user?.id;

      const blogs = await prisma.blog.findMany({
        where: {
          type: type ? (type as string) : undefined,
        },
        include: {
          comments: {
            where: { parentId: null }, // Only get top-level comments
            orderBy: { createdAt: "desc" },
            include: {
              replies: {
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit ? parseInt(limit as string) : undefined,
      });

      // Get blog IDs to check likes
      const blogIds = blogs.map((blog) => blog.id);

      // Get user's likes for these blogs
      const userBlogLikes = userId
        ? await prisma.blogLike.findMany({
            where: {
              userId,
              blogId: { in: blogIds },
            },
            select: { blogId: true },
          })
        : [];
      const likedBlogIds = new Set(userBlogLikes.map((bl) => bl.blogId));

      // Parse tags and filter by tag if specified
      // Get unique user IDs from comments
      const userIds = new Set<number>();
      blogs.forEach((blog) => {
        blog.comments.forEach((comment) => {
          userIds.add(comment.userId);
          comment.replies.forEach((reply) => userIds.add(reply.userId));
        });
      });

      // Fetch user data
      const users = await prisma.user.findMany({
        where: { id: { in: Array.from(userIds) } },
        select: { id: true, name: true, avatar: true },
      });

      const userMap = new Map(
        users.map((u) => [u.id, { name: u.name, photo: u.avatar }]),
      );

      let parsedBlogs = blogs.map((blog) => ({
        ...blog,
        tags: blog.tags ? JSON.parse(blog.tags) : [],
        date: blog.createdAt.toISOString().split("T")[0],
        isLikedByUser: likedBlogIds.has(blog.id),
        comments: blog.comments.map((comment) => {
          const userInfo = userMap.get(comment.userId);
          return {
            id: comment.id,
            userId: comment.userId.toString(),
            userName: userInfo?.name || "Bilinmeyen Kullanıcı",
            userPhoto: userInfo?.photo || undefined,
            content: comment.content,
            likes: comment.likes,
            date: comment.createdAt.toISOString(),
            replies: comment.replies.map((reply) => {
              const replyUserInfo = userMap.get(reply.userId);
              return {
                id: reply.id,
                userId: reply.userId.toString(),
                userName: replyUserInfo?.name || "Bilinmeyen Kullanıcı",
                userPhoto: replyUserInfo?.photo || undefined,
                content: reply.content,
                likes: reply.likes,
                date: reply.createdAt.toISOString(),
              };
            }),
          };
        }),
      }));

      // Filter by tag if specified
      if (tag) {
        parsedBlogs = parsedBlogs.filter((blog) =>
          blog.tags.includes(tag as string),
        );
      }

      res.json(parsedBlogs);
    } catch (error) {
      console.error("Get blogs error:", error);
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  },
);

// Get single blog by ID (public, with optional auth for like status)
router.get(
  "/blogs/:id",
  optionalAuthenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const userId = req.user?.id;

      const blog = await prisma.blog.findUnique({
        where: { id },
        include: {
          comments: {
            where: { parentId: null },
            orderBy: { createdAt: "desc" },
            include: {
              replies: {
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
      });

      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      // Increment views
      await prisma.blog.update({
        where: { id },
        data: { views: blog.views + 1 },
      });

      // Check if user liked this blog
      let isLikedByUser = false;
      if (userId) {
        const blogLike = await prisma.blogLike.findUnique({
          where: {
            userId_blogId: {
              userId,
              blogId: id,
            },
          },
        });
        isLikedByUser = !!blogLike;
      }

      // Get unique user IDs from comments
      const userIds = new Set<number>();
      blog.comments.forEach((comment) => {
        userIds.add(comment.userId);
        comment.replies.forEach((reply) => userIds.add(reply.userId));
      });

      // Fetch user data
      const users = await prisma.user.findMany({
        where: { id: { in: Array.from(userIds) } },
        select: { id: true, name: true, avatar: true },
      });

      const userMap = new Map(
        users.map((u) => [u.id, { name: u.name, photo: u.avatar }]),
      );

      // Get comment likes for current user
      const commentIds = blog.comments.flatMap((c) => [
        c.id,
        ...c.replies.map((r) => r.id),
      ]);
      const userCommentLikes = userId
        ? await prisma.commentLike.findMany({
            where: {
              userId,
              commentId: { in: commentIds },
            },
            select: { commentId: true },
          })
        : [];
      const likedCommentIds = new Set(
        userCommentLikes.map((cl) => cl.commentId),
      );

      const parsedBlog = {
        ...blog,
        tags: blog.tags ? JSON.parse(blog.tags) : [],
        date: blog.createdAt.toISOString().split("T")[0],
        isLikedByUser,
        comments: blog.comments.map((comment) => {
          const userInfo = userMap.get(comment.userId);
          return {
            id: comment.id,
            userId: comment.userId.toString(),
            userName: userInfo?.name || "Bilinmeyen Kullanıcı",
            userPhoto: userInfo?.photo || undefined,
            content: comment.content,
            likes: comment.likes,
            date: comment.createdAt.toISOString(),
            isLikedByUser: likedCommentIds.has(comment.id),
            replies: comment.replies.map((reply) => {
              const replyUserInfo = userMap.get(reply.userId);
              return {
                id: reply.id,
                userId: reply.userId.toString(),
                userName: replyUserInfo?.name || "Bilinmeyen Kullanıcı",
                userPhoto: replyUserInfo?.photo || undefined,
                content: reply.content,
                likes: reply.likes,
                date: reply.createdAt.toISOString(),
                isLikedByUser: likedCommentIds.has(reply.id),
              };
            }),
          };
        }),
      };

      res.json(parsedBlog);
    } catch (error) {
      console.error("Get blog error:", error);
      res.status(500).json({ error: "Failed to fetch blog" });
    }
  },
);

// Create blog (admin only)
router.post(
  "/blogs",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        type,
        title,
        description,
        content,
        image,
        teacher,
        readTime,
        tags,
      } = req.body;

      // Validate required fields
      if (
        !type ||
        !title ||
        !description ||
        !content ||
        !image ||
        !teacher ||
        !readTime
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const blog = await prisma.blog.create({
        data: {
          type,
          title,
          description,
          content,
          image,
          teacher,
          readTime,
          tags: tags ? JSON.stringify(tags) : JSON.stringify([]),
        },
      });

      res.status(201).json(blog);
    } catch (error) {
      console.error("Create blog error:", error);
      res.status(500).json({ error: "Failed to create blog" });
    }
  },
);

// Update blog (admin only)
router.put(
  "/blogs/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const {
        type,
        title,
        description,
        content,
        image,
        teacher,
        readTime,
        tags,
      } = req.body;

      const blog = await prisma.blog.update({
        where: { id },
        data: {
          type,
          title,
          description,
          content,
          image,
          teacher,
          readTime,
          tags: tags ? JSON.stringify(tags) : undefined,
        },
      });

      res.json(blog);
    } catch (error) {
      console.error("Update blog error:", error);
      res.status(500).json({ error: "Failed to update blog" });
    }
  },
);

// Delete blog (admin only)
router.delete(
  "/blogs/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params as { id: string };

      await prisma.blog.delete({
        where: { id },
      });

      res.json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.error("Delete blog error:", error);
      res.status(500).json({ error: "Failed to delete blog" });
    }
  },
);

// Like/Unlike blog (authenticated users)
router.post(
  "/blogs/:id/like",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const userId = req.user!.id;

      const result = await prisma.$transaction(async (tx) => {
        const existingBlog = await tx.blog.findUnique({
          where: { id },
          select: { id: true },
        });

        if (!existingBlog) {
          return null;
        }

        let isLiked = false;
        const existingLike = await tx.blogLike.findUnique({
          where: {
            userId_blogId: {
              userId,
              blogId: id,
            },
          },
        });

        if (existingLike) {
          try {
            await tx.blogLike.delete({
              where: { id: existingLike.id },
            });
          } catch (deleteError) {
            // Concurrent request may already remove this like.
            if (
              !(
                deleteError instanceof Prisma.PrismaClientKnownRequestError &&
                deleteError.code === "P2025"
              )
            ) {
              throw deleteError;
            }
          }
          isLiked = false;
        } else {
          try {
            await tx.blogLike.create({
              data: {
                userId,
                blogId: id,
              },
            });
            isLiked = true;
          } catch (createError) {
            // Concurrent request may already create this like.
            if (
              createError instanceof Prisma.PrismaClientKnownRequestError &&
              createError.code === "P2002"
            ) {
              isLiked = true;
            } else {
              throw createError;
            }
          }
        }

        const likes = await tx.blogLike.count({ where: { blogId: id } });
        await tx.blog.update({
          where: { id },
          data: { likes },
        });

        return { likes, isLiked };
      });

      if (!result) {
        return res.status(404).json({ error: "Blog not found" });
      }

      return res.json(result);
    } catch (error) {
      console.error("Toggle blog like error:", error);
      res.status(500).json({ error: "Failed to toggle blog like" });
    }
  },
);

// ==================== BLOG COMMENTS ====================

// Add comment to blog (authenticated users)
router.post(
  "/blogs/:id/comments",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const { content, parentId } = req.body;
      const userId = req.user!.id;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: "Comment content is required" });
      }

      const comment = await prisma.blogComment.create({
        data: {
          blogId: id,
          userId,
          content,
          parentId: parentId || null,
        },
      });

      // Get user info
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, avatar: true },
      });

      res.status(201).json({
        id: comment.id,
        userId: comment.userId.toString(),
        userName: user?.name || "Bilinmeyen Kullanıcı",
        userPhoto: user?.avatar || undefined,
        content: comment.content,
        likes: comment.likes,
        date: comment.createdAt.toISOString(),
      });
    } catch (error) {
      console.error("Add comment error:", error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  },
);

// Like/Unlike comment (authenticated users)
router.post(
  "/blogs/comments/:commentId/like",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { commentId } = req.params as { commentId: string };
      const userId = req.user!.id;

      const result = await prisma.$transaction(async (tx) => {
        const existingComment = await tx.blogComment.findUnique({
          where: { id: commentId },
          select: { id: true },
        });

        if (!existingComment) {
          return null;
        }

        let isLiked = false;
        const existingLike = await tx.commentLike.findUnique({
          where: {
            userId_commentId: {
              userId,
              commentId,
            },
          },
        });

        if (existingLike) {
          try {
            await tx.commentLike.delete({
              where: { id: existingLike.id },
            });
          } catch (deleteError) {
            // Concurrent request may already remove this like.
            if (
              !(
                deleteError instanceof Prisma.PrismaClientKnownRequestError &&
                deleteError.code === "P2025"
              )
            ) {
              throw deleteError;
            }
          }
          isLiked = false;
        } else {
          try {
            await tx.commentLike.create({
              data: {
                userId,
                commentId,
              },
            });
            isLiked = true;
          } catch (createError) {
            // Concurrent request may already create this like.
            if (
              createError instanceof Prisma.PrismaClientKnownRequestError &&
              createError.code === "P2002"
            ) {
              isLiked = true;
            } else {
              throw createError;
            }
          }
        }

        const likes = await tx.commentLike.count({ where: { commentId } });
        await tx.blogComment.update({
          where: { id: commentId },
          data: { likes },
        });

        return { likes, isLiked };
      });

      if (!result) {
        return res.status(404).json({ error: "Comment not found" });
      }

      return res.json(result);
    } catch (error) {
      console.error("Toggle comment like error:", error);
      res.status(500).json({ error: "Failed to toggle comment like" });
    }
  },
);

// Delete comment (user's own comment or admin)
router.delete(
  "/blogs/comments/:commentId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { commentId } = req.params as { commentId: string };
      const userId = req.user!.id;
      const isAdmin = req.user!.isAdmin;

      const comment = await prisma.blogComment.findUnique({
        where: { id: commentId },
      });

      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      // Check if user owns the comment or is admin
      if (comment.userId !== userId && !isAdmin) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      await prisma.blogComment.delete({
        where: { id: commentId },
      });

      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Delete comment error:", error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  },
);

// ==================== NEWSLETTER / E-BÜLTEN ====================

// Tüm kullanıcılara veya seçili gruba mail gönder (sadece admin)
router.post(
  "/newsletter/send",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        subject,
        title,
        body,
        ctaText,
        ctaUrl,
        target = "all",
      } = req.body;

      if (!subject || !title || !body) {
        return res
          .status(400)
          .json({ error: "subject, title ve body zorunludur" });
      }

      // Hedef kitleyi belirle
      let whereClause: any = { isActive: true };
      if (target === "students") {
        // En az 1 ödemesi olan kullanıcılar
        whereClause = {
          isActive: true,
          payments: { some: { isSuccessful: true } },
        };
      } else if (target === "free") {
        // Hiç ödemesi olmayan kullanıcılar
        whereClause = { isActive: true, payments: { none: {} } };
      }

      const users = await prisma.user.findMany({
        where: whereClause,
        select: { email: true },
      });

      if (users.length === 0) {
        return res
          .status(404)
          .json({ error: "Gönderilecek kullanıcı bulunamadı" });
      }

      const emails = users.map((u) => u.email);

      // Gönder ve sonucu bekle — hata varsa 500 dön
      try {
        await sendNewsletterEmail(
          emails,
          subject,
          title,
          body,
          ctaText,
          ctaUrl,
        );
      } catch (emailErr: any) {
        console.error("Newsletter email send error:", emailErr);
        return res.status(500).json({
          error: "E-posta gönderilemedi",
          detail: emailErr?.message || String(emailErr),
        });
      }

      res.json({
        message: `${emails.length} kullanıcıya mail gönderildi.`,
        count: emails.length,
      });
    } catch (error) {
      console.error("Newsletter error:", error);
      res.status(500).json({ error: "Newsletter gönderilemedi" });
    }
  },
);

export default router;
