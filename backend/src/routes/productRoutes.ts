import { Router } from "express";
const router = Router();

router.get("/compare/:ean", async (req, res) => {
  const { ean } = req.params;

  // Örnek Simülasyon Verisi (Gerçekte Scraper veya DB'den gelecek)
  const mockComparison = {
    eanCode: ean,
    name: "Global Brand Perfume",
    category: "cosmetics",
    globalPrices: [
      { countryCode: "DE", basePrice: 50, currency: "EUR", shippingFee: 15 },
      { countryCode: "US", basePrice: 45, currency: "USD", shippingFee: 25 },
    ],
  };

  // Burada calculateGatifyTax fonksiyonunu her fiyat için mapleyip sonucu döndüreceğiz
  res.json(mockComparison);
});

export default router;
