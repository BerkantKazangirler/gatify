export interface CustomsRate {
  origin: "EU" | "NON_EU";
  taxRate: number;
  otvRate: number;
}

export interface PriceComparison {
  countryCode: string;
  basePrice: number; // Döviz cinsinden
  currency: string;
  shippingFee: number;
  totalCustoms: number; // TL cinsinden
  finalPriceTry: number; // Kapıya geliş fiyatı
}

export interface ProductDetail {
  eanCode: string;
  name: string;
  category: "cosmetics" | "electronics" | "other";
  globalPrices: PriceComparison[];
}
