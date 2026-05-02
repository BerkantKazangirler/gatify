import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Trust Railway's reverse proxy
app.set("trust proxy", 1);

// CORS Configuration - Only allow requests from production frontend
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
    message: "Welcome to MO Academy API",
    version: "1.0.0",
    docs: "/api/docs",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔧 CORS Origin: ${process.env.CORS_ORIGIN}`);
});

export default app;
