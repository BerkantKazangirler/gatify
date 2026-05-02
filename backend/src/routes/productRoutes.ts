import { Router } from "express";
import { getProductDetails } from "../../services/productService";

const router = Router();

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
