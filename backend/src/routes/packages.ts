import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// Get all active packages
router.get("/", async (req, res: Response) => {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                image: true,
                price: true,
                category: true,
                level: true,
                lessons: true,
                duration: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(packages);
  } catch (error) {
    console.error("Get packages error:", error);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
});

// Get package by ID
router.get("/:packageId", async (req, res: Response) => {
  try {
    const { packageId } = req.params as { packageId: string };

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                image: true,
                price: true,
                category: true,
                level: true,
                lessons: true,
                duration: true,
                teacher: true,
                star: true,
                students: true,
              },
            },
          },
        },
      },
    });

    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }

    res.json(pkg);
  } catch (error) {
    console.error("Get package error:", error);
    res.status(500).json({ error: "Failed to fetch package" });
  }
});

// Check if user has purchased a package
router.get(
  "/:packageId/purchased",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { packageId } = req.params as { packageId: string };

      const purchase = await prisma.payment.findFirst({
        where: {
          userId: req.user!.id,
          packageId,
          isSuccessful: true,
        },
      });

      res.json({ purchased: !!purchase });
    } catch (error) {
      console.error("Check package purchase error:", error);
      res.status(500).json({ error: "Failed to check purchase status" });
    }
  }
);

// Get user's purchased packages
router.get(
  "/user/purchased",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const purchases = await prisma.payment.findMany({
        where: {
          userId: req.user!.id,
          packageId: { not: null },
          isSuccessful: true,
        },
        include: {
          package: {
            include: {
              courses: {
                include: {
                  course: {
                    select: {
                      id: true,
                      title: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json(purchases);
    } catch (error) {
      console.error("Get user packages error:", error);
      res.status(500).json({ error: "Failed to fetch user packages" });
    }
  }
);

// Admin: Create package
router.post(
  "/",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      // Check if admin
      if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const {
        id,
        title,
        description,
        price,
        discount = 0,
        image,
        badge,
        features,
        courseIds,
      } = req.body;

      // Validate courses exist
      const courses = await prisma.course.findMany({
        where: { id: { in: courseIds } },
      });

      if (courses.length !== courseIds.length) {
        return res.status(400).json({ error: "Some courses not found" });
      }

      const pkg = await prisma.package.create({
        data: {
          id,
          title,
          description,
          price,
          discount,
          image,
          badge,
          features: JSON.stringify(features),
          courses: {
            create: courseIds.map((courseId: string) => ({
              courseId,
            })),
          },
        },
        include: {
          courses: {
            include: {
              course: true,
            },
          },
        },
      });

      res.status(201).json(pkg);
    } catch (error) {
      console.error("Create package error:", error);
      res.status(500).json({ error: "Failed to create package" });
    }
  }
);

// Admin: Update package
router.put(
  "/:packageId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      // Check if admin
      if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { packageId } = req.params as { packageId: string };
      const { title, description, price, discount, image, badge, features, courseIds, isActive } =
        req.body;

      // If courseIds provided, update courses
      if (courseIds) {
        // Delete existing courses
        await prisma.packageCourse.deleteMany({
          where: { packageId },
        });

        // Add new courses
        await prisma.packageCourse.createMany({
          data: courseIds.map((courseId: string) => ({
            packageId,
            courseId,
          })),
        });
      }

      const pkg = await prisma.package.update({
        where: { id: packageId },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(price !== undefined && { price }),
          ...(discount !== undefined && { discount }),
          ...(image && { image }),
          ...(badge !== undefined && { badge }),
          ...(features && { features: JSON.stringify(features) }),
          ...(isActive !== undefined && { isActive }),
        },
        include: {
          courses: {
            include: {
              course: true,
            },
          },
        },
      });

      res.json(pkg);
    } catch (error) {
      console.error("Update package error:", error);
      res.status(500).json({ error: "Failed to update package" });
    }
  }
);

// Admin: Delete package
router.delete(
  "/:packageId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      // Check if admin
      if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { packageId } = req.params as { packageId: string };

      await prisma.package.delete({
        where: { id: packageId },
      });

      res.json({ message: "Package deleted successfully" });
    } catch (error) {
      console.error("Delete package error:", error);
      res.status(500).json({ error: "Failed to delete package" });
    }
  }
);

export default router;
