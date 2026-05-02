import { db } from "../lib/firebase"; // Firebase config dosyan
import { ProductsI, RestrictionReason } from "../src/types/product";

/**
 * Tek bir ürünü EAN koduna veya ID'sine göre getirir
 */
export const getProductDetails = async (
  productId: string,
): Promise<ProductsI | null> => {
  try {
    const productRef = db.collection("products").doc(productId);
    const doc = await productRef.get();

    if (!doc.exists) {
      console.log("Ürün bulunamadı!");
      return null;
    }

    return doc.data() as ProductsI;
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    throw error;
  }
};

// Bu fonksiyonu ürün detay sayfasında kullanabilirsin
export const checkCustomsAlert = (
  product: ProductsI,
  userCountry: string = "TR",
) => {
  const restriction = product.notAvailable?.find(
    (r: any) => r.countryCode === userCountry,
  );

  if (restriction?.isBanned) {
    return {
      status: "BANNED",
      message:
        restriction.reason === RestrictionReason.CUSTOMS_RESTRICTION
          ? "Bu ürün Şubat 2026 gümrük kuralları gereği posta ile getirilemez."
          : "Bu ürün şu an seçili ülke için gönderime kapalıdır.",
      isPurchaseDisabled: true,
    };
  }

  return { status: "AVAILABLE", isPurchaseDisabled: false };
};

/**
 * Tüm ürünleri listeler (Amazon tarzı ürün kataloğu için)
 */
export const getAllProducts = async (): Promise<ProductsI[]> => {
  const snapshot = await db.collection("products").get();
  return snapshot.docs.map((doc) => doc.data() as ProductsI);
};
