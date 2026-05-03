// Örnek veri seti (Paylaştığın JSON'lar)
let products = [
  {
    id: 101,
    title: "Calvin Klein CK One (Türkiye Özel Seri)",
    price: 1499.9,
    category: "fragrances",
    brand: "Calvin Klein",
    meta: { origin: "TR" },
    salerId: "seller_1", // Router'daki salerId filtresi için eklendi
  },
  {
    id: 203,
    title: "Nike Air Max 270 (Global Edition)",
    price: 160.0,
    category: "fashion",
    brand: "Nike",
    meta: { origin: "Global" },
    salerId: "seller_2",
  },
  {
    id: 201,
    title: "Mavi %100 Pamuklu Klasik Denim Ceket",
    price: 1899.99,
    category: "fashion",
    brand: "Mavi",
    meta: { origin: "TR" },
    salerId: "seller_1",
  },
  {
    id: 101,
    title: "Calvin Klein CK One (Türkiye Özel Seri)",
    description:
      "CK One, tazeliği ve temiz kokusuyla bilinen klasik bir unisex parfümdür. Günlük kullanım için ideal, ferah bir esans.",
    category: "fragrances",
    price: 1499.9,
    discountPercentage: 10.0,
    rating: 4.8,
    stock: 45,
    tags: ["parfüm", "unisex", "kozmetik"],
    brand: "Calvin Klein",
    sku: "TR-FRA-CK-001",
    weight: 5,
    dimensions: { width: 10.0, height: 15.0, depth: 5.0 },
    warrantyInformation: "2 Yıl Distribütör Garantili",
    shippingInformation: "Aynı Gün Ücretsiz Kargo",
    availabilityStatus: "Stokta Var",
    reviews: [
      {
        rating: 5,
        comment: "Çok ferah, tam yazlık!",
        date: "2026-05-01T10:00:00.000Z",
        reviewerName: "Caner Yılmaz",
        reviewerEmail: "caner@email.tr",
      },
    ],
    returnPolicy: "14 Gün İçinde Ücretsiz İade",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2026-05-01T10:00:00.000Z",
      barcode: "TR869123456789",
      origin: "TR",
    },
    images: [
      "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/1.webp",
    ],
    thumbnail:
      "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
  },
  {
    id: 102,
    title: "Dior J'adore (Yerli Distribütör)",
    description:
      "Lüks ve çiçeksi notalarıyla feminenliğin simgesi. Türkiye'deki yetkili bayilerden temin edilmiştir.",
    category: "fragrances",
    price: 3250.0,
    discountPercentage: 5.0,
    rating: 4.9,
    stock: 20,
    tags: ["kadın parfüm", "lüks", "dior"],
    brand: "Dior",
    sku: "TR-FRA-DIO-002",
    weight: 4,
    warrantyInformation: "Orijinallik Sertifikalı",
    shippingInformation: "2 İş Gününde Teslimat",
    availabilityStatus: "Stokta Var",
    meta: {
      origin: "TR",
    },
    thumbnail:
      "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp",
  },
  {
    id: 203,
    title: "Nike Air Max 270 (Global Edition)",
    description:
      "Nike'ın en ikonik modellerinden biri. Maksimum konfor ve sportif şıklık için tasarlandı. Global stoklardan gönderim yapılır.",
    category: "fashion",
    price: 160.0,
    discountPercentage: 5.0,
    rating: 4.9,
    stock: 85,
    tags: ["shoes", "sneakers", "nike", "global"],
    brand: "Nike",
    sku: "GLO-FAS-NIK-203",
    weight: 1200,
    dimensions: {
      width: 35.0,
      height: 25.0,
      depth: 12.0,
    },
    warrantyInformation: "International Limited Warranty",
    shippingInformation: "International Shipping (7-14 business days)",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Perfect fit and very comfortable for long walks.",
        date: "2026-05-02T09:00:00.000Z",
        reviewerName: "John Doe",
        reviewerEmail: "john@global.com",
      },
    ],
    returnPolicy: "30 days global return policy",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2026-05-02T08:00:00.000Z",
      barcode: "0123456789012",
      origin: "Global",
    },
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
  },
  {
    id: 204,
    title: "Zara Slim Fit Wool Blend Coat",
    description:
      "Elegant wool blend coat for a sophisticated look. Part of the European Autumn/Winter collection.",
    category: "fashion",
    price: 129.9,
    discountPercentage: 12.0,
    rating: 4.7,
    stock: 42,
    tags: ["coat", "winter", "zara", "europe"],
    brand: "Zara",
    sku: "GLO-FAS-ZAR-204",
    weight: 1500,
    warrantyInformation: "Quality guaranteed by Zara Global",
    shippingInformation: "Priority shipping from Spain",
    availabilityStatus: "In Stock",
    meta: {
      origin: "Global",
      collection: "FW2026",
    },
    images: [
      "https://images.unsplash.com/photo-1539533377285-342111a33b2f?q=80&w=1000&auto=format&fit=crop",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1539533377285-342111a33b2f?w=200",
  },
  {
    id: 201,
    title: "Mavi %100 Pamuklu Klasik Denim Ceket",
    description:
      "Yüksek kaliteli denim kumaştan üretilmiştir. Türkiye'nin tekstil gücünü yansıtan, uzun ömürlü ve zamansız bir parça.",
    category: "fashion",
    price: 1899.99,
    discountPercentage: 15.0,
    rating: 4.9,
    stock: 120,
    tags: ["giyim", "denim", "yerli-üretim", "ilkbahar"],
    brand: "Mavi",
    sku: "TR-FAS-MAV-201",
    weight: 850,
    dimensions: {
      width: 40.0,
      height: 60.0,
      depth: 5.0,
    },
    warrantyInformation: "Üretim hatalarına karşı 1 yıl garantili",
    shippingInformation: "24 saat içinde kargoda",
    availabilityStatus: "Stokta Var",
    reviews: [
      {
        rating: 5,
        comment: "Kalıbı mükemmel, kumaşı çok kaliteli.",
        date: "2026-05-02T14:20:00.000Z",
        reviewerName: "Mert Demir",
        reviewerEmail: "mert@email.tr",
      },
    ],
    returnPolicy: "Mağazadan değişim ve 30 gün iade imkanı",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2026-05-02T10:00:00.000Z",
      barcode: "8691020304050",
      origin: "TR",
    },
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a103055b19c?q=80&w=1000&auto=format&fit=crop",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1576995853123-5a103055b19c?w=200",
  },
  {
    id: 202,
    title: "Koton Oversize Nakışlı Tişört",
    description:
      "Yaz ayları için nefes alan kumaş yapısı. Modern kesim ve şık nakış detayları ile günlük şıklık sunar.",
    category: "fashion",
    price: 449.5,
    discountPercentage: 20.0,
    rating: 4.6,
    stock: 350,
    tags: ["tişört", "günlük", "oversize"],
    brand: "Koton",
    sku: "TR-FAS-KOT-202",
    weight: 250,
    warrantyInformation: "Yıkama talimatlarına uyulduğunda solmama garantisi",
    shippingInformation: "Tüm Türkiye'ye 3 günde teslim",
    availabilityStatus: "Stokta Var",
    meta: {
      origin: "TR",
      material: "Organic Cotton",
    },
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
  },
  {
    id: 203,
    title: "Levi's Trucker Denim Jacket",
    description:
      "The original jean jacket since 1967. A symbol of self-expression for decades and a great starting point for customization.",
    category: "fashion",
    price: 89.5,
    discountPercentage: 10.0,
    rating: 4.8,
    stock: 85,
    tags: ["apparel", "denim", "classic", "essential"],
    brand: "Levi's",
    sku: "GLO-FAS-LEV-203",
    weight: 900,
    dimensions: {
      width: 42.0,
      height: 62.0,
      depth: 6.0,
    },
    warrantyInformation: "2-year global limited warranty",
    shippingInformation: "International priority shipping available",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Timeless design and extremely durable material.",
        date: "2026-05-02T16:00:00.000Z",
        reviewerName: "James Wilson",
        reviewerEmail: "james.w@globalmail.com",
      },
    ],
    returnPolicy: "Global 45-day return policy",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2026-05-02T11:00:00.000Z",
      barcode: "0123456789012",
      origin: "Global",
    },
    images: [
      "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?q=80&w=1000&auto=format&fit=crop",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=200",
  },
  {
    id: 204,
    title: "Nike Sportswear Essential T-Shirt",
    description:
      "Crafted from soft cotton jersey, the Nike Sportswear Essential Top features a clean look and a classic fit.",
    category: "fashion",
    price: 35.0,
    discountPercentage: 5.0,
    rating: 4.7,
    stock: 500,
    tags: ["sportswear", "casual", "nike-air"],
    brand: "Nike",
    sku: "GLO-FAS-NIK-204",
    weight: 280,
    warrantyInformation: "Guaranteed quality by Nike International",
    shippingInformation: "Ships worldwide from central warehouse",
    availabilityStatus: "In Stock",
    meta: {
      origin: "Global",
      material: "Sustainable Cotton",
    },
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
  },
  {
    id: 201,
    title: "Nike Air Max 270 (Türkiye Stok)",
    description:
      "Nike'ın en popüler modellerinden biri. Türkiye yetkili distribütör garantisiyle. Gün boyu konfor ve şık görünüm sağlar.",
    category: "fashion",
    price: 6499.9,
    discountPercentage: 10.0,
    rating: 4.9,
    stock: 45,
    tags: ["ayakkabı", "sneaker", "nike-tr", "spor"],
    brand: "Nike",
    sku: "TR-FAS-NIK-201",
    weight: 1200,
    dimensions: {
      width: 35.0,
      height: 25.0,
      depth: 12.0,
    },
    warrantyInformation: "2 Yıl Nike Türkiye Garantili",
    shippingInformation: "Aynı Gün Ücretsiz Kargo (Yurtiçi Kargo)",
    availabilityStatus: "Stokta Var",
    reviews: [
      {
        rating: 5,
        comment: "Orijinal ürün, çok hızlı geldi. Teşekkürler!",
        date: "2026-05-02T14:20:00.000Z",
        reviewerName: "Selim Ak",
        reviewerEmail: "selim@email.tr",
      },
    ],
    returnPolicy: "14 gün içinde ücretsiz iade hakkı",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2026-05-02T10:00:00.000Z",
      barcode: "8691234567890",
      origin: "TR",
    },
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
  },
];

export const getAllProducts = async (salerId: any) => {
  if (salerId) {
    return products.filter((p) => p.salerId === salerId);
  }
  return products;
};

export const getProductDetails = async (id: any) => {
  return products.find((p) => p.id === parseInt(id)) || null;
};

export const createProduct = async (productData: any) => {
  const newId =
    products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const newProduct = { id: newId, ...productData };
  products.push(newProduct);
  return newId;
};

export const updateProduct = async (id: any, productData: any) => {
  const index = products.findIndex((p) => p.id === parseInt(id));
  if (index !== -1) {
    products[index] = { ...products[index], ...productData };
    return products[index].id;
  }
  throw new Error("Ürün bulunamadı");
};

export const getSellerDashboard = async (salerId: any) => {
  const sellerProducts = products.filter((p) => p.salerId === salerId);
  return {
    totalProducts: sellerProducts.length,
    totalStock: sellerProducts.reduce((sum, p) => sum + (p.stock || 0), 0),
    categories: [...new Set(sellerProducts.map((p) => p.category))],
    recentProducts: sellerProducts.slice(-5),
  };
};
