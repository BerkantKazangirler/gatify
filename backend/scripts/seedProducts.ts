/*
  Seed script for adding sample products to Firestore via backend service.
  Run with: `pnpm/ npm/yarn` using the backend workspace, e.g.
    npx tsx backend/scripts/seedProducts.ts

  Note: ensure your Firebase admin credentials are configured (env or service account file)
  so `backend/lib/firebase.ts` can initialize `db`.
*/
import { createProduct } from "../services/productService.js";

const samples = [
  {
    name: "Premium Wireless Headphones",
    category: "electronics",
    price: 299,
    globalPrice: 299,
    localPrice: 299,
    stock: 156,
    ean: "WHD-2024-PRO",
    sku: "WHD-2024-PRO",
    origin: "USA",
    country: "USA",
    salerId: "salerTest",
    description: "High-fidelity wireless headphones with ANC.",
    image: "https://placehold.co/400x300",
    raw: { sales: 89, origin: "USA" },
  },
  {
    name: "Smart Home Assistant",
    category: "home",
    price: 149,
    globalPrice: 149,
    localPrice: 149,
    stock: 234,
    ean: "SHA-2024-V2",
    sku: "SHA-2024-V2",
    origin: "Germany",
    country: "Germany",
    salerId: "salerTest",
    description: "Voice-controlled smart home hub.",
    image: "https://placehold.co/400x300",
    raw: { sales: 142, origin: "Germany" },
  },
  {
    name: "Portable Power Bank 20000mAh",
    category: "accessories",
    price: 45,
    globalPrice: 45,
    localPrice: 45,
    stock: 12,
    ean: "PPB-20K-BLK",
    sku: "PPB-20K-BLK",
    origin: "Japan",
    country: "Japan",
    salerId: "salerTest",
    description: "High-capacity USB-C power bank.",
    image: "https://placehold.co/400x300",
    raw: { sales: 276, origin: "Japan" },
  },
  {
    name: "4K Action Camera",
    category: "electronics",
    price: 399,
    globalPrice: 399,
    localPrice: 399,
    stock: 67,
    ean: "CAM-4K-PRO",
    sku: "CAM-4K-PRO",
    origin: "UK",
    country: "UK",
    salerId: "salerTest",
    description: "Rugged 4K action camera with stabilization.",
    image: "https://placehold.co/400x300",
    raw: { sales: 54, origin: "UK" },
  },
  {
    name: "Ergonomic Keyboard",
    category: "accessories",
    price: 129,
    globalPrice: 129,
    localPrice: 129,
    stock: 0,
    ean: "KBD-ERG-2024",
    sku: "KBD-ERG-2024",
    origin: "Australia",
    country: "Australia",
    salerId: "salerTest",
    description: "Split ergonomic keyboard for comfort.",
    image: "https://placehold.co/400x300",
    raw: { sales: 198, origin: "Australia" },
  },
];

async function main() {
  console.log("Seeding products... (ensure backend env is configured)");
  for (const item of samples) {
    try {
      const id = await createProduct({
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log("Created product id:", id, "->", item.name);
    } catch (err) {
      console.error("Failed to create product", item.name, err);
    }
  }
  console.log("Seeding finished.");
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export default main;
