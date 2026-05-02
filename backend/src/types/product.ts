export interface CategoryI {
  id: string;
  name: string;
  maxLimit: number;
  priority: number;
}

export enum RestrictionReason {
  CUSTOMS_RESTRICTION = "CUSTOMS_RESTRICTION", // Gümrük mevzuatı gereği yasak
  SHIPPING_NOT_SUPPORTED = "SHIPPING_NOT_SUPPORTED", // Bu ülkeden Türkiye'ye gönderim yok
  GOVERNMENT_BANNED = "GOVERNMENT_BANNED", // Devlet tarafından tamamen yasaklanmış ürün
}

export interface NotAvailableI {
  countryCode: string; // "TR", "DE" vb.
  reason: RestrictionReason;
  isBanned: boolean;
}

export interface ProductsI {
  id: string;
  code: string;
  photo: string;
  model3D?: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  salerId: string;
  categoryId: string;
  notAvailable: NotAvailableI[];
}
