import { Router, Response, Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { sendPurchaseConfirmationEmail } from "../lib/email";
import {
  createLemonSqueezyCheckout,
  handleLemonSqueezyWebhook,
} from "../contollers/lemonsqueezyController";
import {
  createIyzicoCheckout,
  handleIyzicoCallback,
  verifyIyzicoPayment,
} from "../contollers/iyzicoController";

const router = Router();

const TAX_RATE = 0.2; // 20% KDV

// ============ LEMONSQUEEZY PAYMENT ROUTES (International) ============

// Create LemonSqueezy checkout session
router.post(
  "/lemonsqueezy/create-checkout",
  authenticate,
  createLemonSqueezyCheckout,
);

// LemonSqueezy webhook endpoint (raw body handled in server.ts)
router.post("/lemonsqueezy/webhook", handleLemonSqueezyWebhook);

// ============ IYZICO PAYMENT ROUTES (Turkey) ============

// Create Iyzico checkout form
router.post("/iyzico/create-checkout", authenticate, createIyzicoCheckout);

// Iyzico callback endpoint
router.post("/iyzico/callback", handleIyzicoCallback);

// Verify Iyzico payment
router.get("/iyzico/verify/:token", authenticate, verifyIyzicoPayment);

// ============ LEGACY PAYMENT ROUTES ============

// Create payment
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, packageId, paymentMethod = "credit_card" } = req.body;

    // Must provide either courseId or packageId, not both
    if ((!courseId && !packageId) || (courseId && packageId)) {
      return res.status(400).json({
        error: "Provide either courseId or packageId, not both",
      });
    }

    let amount = 0;
    let itemTitle = "";

    // Process course purchase
    if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Check if already purchased
      const existing = await prisma.payment.findFirst({
        where: {
          userId: req.user!.id,
          courseId,
          isSuccessful: true,
        },
      });

      if (existing) {
        return res.status(400).json({ error: "Kurs zaten alınmış" });
      }

      amount = course.price;
      itemTitle = course.title;
    }

    // Process package purchase
    if (packageId) {
      const pkg = await prisma.package.findUnique({
        where: { id: packageId },
        include: {
          courses: {
            include: {
              course: true,
            },
          },
        },
      });

      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }

      if (!pkg.isActive) {
        return res.status(400).json({ error: "Package is not available" });
      }

      // Check if already purchased
      const existing = await prisma.payment.findFirst({
        where: {
          userId: req.user!.id,
          packageId,
          isSuccessful: true,
        },
      });

      if (existing) {
        return res.status(400).json({ error: "Paket zaten alınmış" });
      }

      // Apply discount if available
      amount = pkg.price * (1 - pkg.discount / 100);
      itemTitle = pkg.title;
    }

    // Calculate amounts
    const tax = amount * TAX_RATE;
    const total = amount + tax;

    // Generate transaction ID
    const transactionId = `TXN-${uuidv4().substring(0, 12).toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        userId: req.user!.id,
        ...(courseId && { courseId }),
        ...(packageId && { packageId }),
        amount,
        tax,
        total,
        paymentMethod,
        transactionId,
        status: "completed",
        isSuccessful: true,
      },
    });

    res.status(201).json(payment);

    // Satın alma onay maili gönder
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { email: true, name: true },
    });
    if (user) {
      sendPurchaseConfirmationEmail(
        user.email,
        user.name,
        itemTitle,
        total,
        transactionId,
        !!courseId,
      ).catch((err) => console.error("Purchase email error:", err));
    }
  } catch (error) {
    console.error("Create payment error:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

// Get user's payments
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user!.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
        package: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(payments);
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

// Get payment by ID
router.get(
  "/:paymentId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const paymentId = parseInt(req.params.paymentId as string);

      const payment = await prisma.payment.findFirst({
        where: {
          id: paymentId,
          userId: req.user!.id,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              image: true,
            },
          },
          package: {
            select: {
              id: true,
              title: true,
              image: true,
            },
          },
        },
      });

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      res.json(payment);
    } catch (error) {
      console.error("Get payment error:", error);
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  },
);

export default router;
