import { db } from "../lib/firebase.js";

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

type FirestoreProductInput = Record<string, any> & { id?: string };

export const mapFirestoreToProduct = (
  id: string,
  data: FirestoreProductInput,
): FirestoreProductRecord => ({
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
});

export const getProductDetails = async (
  productId: string,
): Promise<FirestoreProductRecord | null> => {
  const snap = await db.collection("products").doc(productId).get();
  if (!snap.exists) return null;
  return mapFirestoreToProduct(snap.id, snap.data() as FirestoreProductInput);
};

export const getAllProducts = async (
  salerId?: string,
): Promise<FirestoreProductRecord[]> => {
  const queryRef = salerId
    ? db.collection("products").where("salerId", "==", salerId)
    : db.collection("products");
  const snap = await queryRef.get();

  return snap.docs.map((item) =>
    mapFirestoreToProduct(item.id, item.data() as FirestoreProductInput),
  );
};

export const createProduct = async (data: FirestoreProductInput) => {
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const res = await db.collection("products").add(payload);
  return res.id;
};

export const updateProduct = async (
  productId: string,
  data: FirestoreProductInput,
) => {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await db.collection("products").doc(productId).set(payload, { merge: true });
  return productId;
};

export const getSellerDashboard = async (salerId?: string) => {
  const products = await getAllProducts(salerId);

  const totalRevenue = products.reduce((acc, p) => {
    const sales = Number(p.raw?.sales ?? 0);
    const price = Number(p.globalPrice ?? p.raw?.price ?? 0);
    return acc + sales * price;
  }, 0);

  const totalOrders = products.reduce(
    (acc, p) => acc + Number(p.raw?.sales ?? 0),
    0,
  );

  const activeProducts = products.filter((p) => (p.stock ?? 0) > 0).length;

  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Simple monthly distribution (last 5 months) from totalOrders
  const months = ["Jan", "Feb", "Mar", "Apr", "May"];
  const perMonth = Math.floor(totalOrders / months.length);
  const salesData = months.map((m, i) => ({
    month: m,
    revenue: perMonth * Math.round(totalRevenue / Math.max(1, totalOrders)),
    orders: perMonth,
  }));

  // Top countries by summed orders (using raw.origin or country)
  const countryMap: Record<string, { orders: number; revenue: number }> = {};
  for (const p of products) {
    const country = (p.raw?.origin as string) || p.country || "Unknown";
    const sales = Number(p.raw?.sales ?? 0);
    const price = Number(p.globalPrice ?? p.raw?.price ?? 0);
    countryMap[country] = countryMap[country] || { orders: 0, revenue: 0 };
    countryMap[country].orders += sales;
    countryMap[country].revenue += sales * price;
  }
  const topCountries = Object.entries(countryMap)
    .map(([country, v]) => ({ country, orders: v.orders, revenue: v.revenue }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);

  // Recent orders mock (from products with sales)
  const recentOrders: Array<{
    id: string;
    product: string;
    destination: string;
    buyer: string;
    amount: number;
    date: string;
  }> = [];
  for (const p of products) {
    const sales = Number(p.raw?.sales ?? 0);
    if (sales > 0 && recentOrders.length < 6) {
      recentOrders.push({
        id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        product: p.name,
        destination: (p.raw?.origin as string) || p.country || "USA",
        buyer: "Buyer",
        amount: Number(p.globalPrice ?? p.raw?.price ?? 0),
        date: new Date().toLocaleDateString(),
      });
    }
  }

  return {
    totalRevenue,
    totalOrders,
    activeProducts,
    avgOrderValue,
    salesData,
    topCountries,
    recentOrders,
  };
};
