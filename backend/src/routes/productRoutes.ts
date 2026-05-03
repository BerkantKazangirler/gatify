import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  getSellerDashboard,
} from "../../services/productService.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const salerId =
      typeof req.query.salerId === "string" ? req.query.salerId : undefined;
    const products = await getAllProducts(salerId);
    res.json(products);
  } catch (err) {
    console.error("Ürün listesi alınamadı", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    const salerId =
      typeof req.query.salerId === "string" ? req.query.salerId : undefined;
    const data = await getSellerDashboard(salerId);
    res.json(data);
  } catch (err) {
    console.error("Dashboard alınamadı", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

router.post("/", async (req, res) => {
  try {
    const id = await createProduct(req.body);
    const created = await getProductDetails(id);
    res.status(201).json(created ?? { id });
  } catch (err) {
    console.error("Ürün oluşturulamadı", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = await updateProduct(req.params.id, req.body);
    const updated = await getProductDetails(id);
    res.json(updated ?? { id });
  } catch (err) {
    console.error("Ürün güncellenemedi", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await getProductDetails(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

export default router;
