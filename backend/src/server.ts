import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// --- Middleware ---
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-locale"],
    optionsSuccessStatus: 200,
  }),
);

app.use("/api/products", productRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    project: "Gatify API",
    status: "active",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "İstediğiniz rota bulunamadı." });
});
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("❌ Sunucu Hatası:", err.stack);
  res.status(500).json({
    error: "Sunucu tarafında bir hata oluştu.",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Gatify Server running on http://localhost:${PORT}`);
  console.log(`🌍 Mode: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV === "development") {
    console.log(`🔧 Debug: CORS Origin is ${process.env.CORS_ORIGIN}`);
  }
});

export default app;
