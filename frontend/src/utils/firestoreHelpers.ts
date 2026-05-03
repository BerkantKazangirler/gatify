import { requestJson } from "./apiHelpers";

export type FirestoreProductRecord = {
  id: string;
  name: string;
  category: string;
  globalPrice: number;
  localPrice: number;
  country: string;
  risk: string;
  image: string;
  description: string;
  sku: string;
  stock: number;
  salerId: string | null;
  raw: Record<string, unknown>;
};

export function mapFirestoreToProduct(
  id: string,
  data: any,
): FirestoreProductRecord {
  return {
    id,
    name: data.name || data.title || "Untitled",
    category: data.category || data.categoryId || "Uncategorized",
    globalPrice: Number(data.price ?? data.globalPrice ?? 0),
    localPrice: Number(data.localPrice ?? data.local_price ?? data.price ?? 0),
    country: data.origin || data.country || "",
    risk: data.risk || "Low",
    image: data.photo || data.image || "📦",
    description: data.description || "",
    sku: data.ean || data.sku || id,
    stock: Number(data.stock ?? 0),
    salerId: data.salerId || data.sellerId || null,
    raw: data,
  };
}

export async function fetchProductById(id: string) {
  const product = await requestJson<any>(`/products/${id}`);
  return mapFirestoreToProduct(product.id ?? id, product);
}

export async function fetchAllProducts(salerId?: string) {
  const query = salerId ? `?salerId=${encodeURIComponent(salerId)}` : "";
  const products = await requestJson<any[]>(`/products${query}`);
  return products.map((product) => mapFirestoreToProduct(product.id, product));
}

export async function saveProduct(data: any) {
  if (data.id) {
    const product = await requestJson<any>(`/products/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return product.id ?? data.id;
  }

  const product = await requestJson<any>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return product.id;
}

export async function fetchSellerDashboard(salerId?: string) {
  const query = salerId ? `?salerId=${encodeURIComponent(salerId)}` : "";
  return await requestJson<any>(`/products/dashboard${query}`);
}
