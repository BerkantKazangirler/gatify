import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest, requireAdmin } from "../middleware/auth";

const router = Router();

// Get all users (Admin only)
router.get("/", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                isAdmin: true,
                isActive: true,
                phone: true,
                avatar: true,
                createdAt: true,
                _count: {
                    select: {
                        payments: true,
                        certificates: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(users);
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Get user by ID (Admin only)
router.get(
  "/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.id as string);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
          isActive: true,
          phone: true,
          avatar: true,
          createdAt: true,
          payments: {
            where: { isSuccessful: true },
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  image: true,
                  price: true,
                },
              },
            },
          },
          certificates: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          videoProgress: {
            where: { status: "completed" },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  },
);

// Add course to user (Admin only)
router.post(
  "/:id/courses",
  authenticate,
  requireAdmin,
  [body("courseId").notEmpty().withMessage("Course ID is required")],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = parseInt(req.params.id as string);
      const { courseId } = req.body;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if course exists
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Check if user already has the course
      const existingPayment = await prisma.payment.findFirst({
        where: {
          userId,
          courseId,
          isSuccessful: true,
        },
      });

      if (existingPayment) {
        return res.status(400).json({ error: "User already has this course" });
      }

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          userId,
          courseId,
          amount: course.price,
          tax: 0,
          total: course.price,
          isSuccessful: true,
          paymentMethod: "admin",
        },
      });

      res.json({ success: true, payment });
    } catch (error) {
      console.error("Add course error:", error);
      res.status(500).json({ error: "Failed to add course" });
    }
  },
);

// Remove course from user (Admin only)
router.delete(
  "/:id/courses/:courseId",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.id as string);
      const { courseId } = req.params as { courseId: string };

      // Find the payment
      const payment = await prisma.payment.findFirst({
        where: {
          userId,
          courseId,
          isSuccessful: true,
        },
      });

      if (!payment) {
        return res
          .status(404)
          .json({ error: "Course not found for this user" });
      }

      // Delete the payment
      await prisma.payment.delete({
        where: { id: payment.id },
      });

      // Also delete related video progress
      await prisma.videoProgress.deleteMany({
        where: {
          userId,
          video: {
            section: {
              courseId,
            },
          },
        },
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Remove course error:", error);
      res.status(500).json({ error: "Failed to remove course" });
    }
  },
);

// Toggle user active status (Admin only) - Soft delete
router.patch(
  "/:id/toggle-active",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.id as string);

      // Can't deactivate yourself
      if (userId === req.user!.id) {
        return res
          .status(400)
          .json({ error: "Cannot deactivate your own account" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          isActive: !user.isActive,
        },
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
        },
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Toggle active error:", error);
      res.status(500).json({ error: "Failed to update user status" });
    }
  },
);

export default router;
