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
    id: "seed_1",
    name: "Meta Quest 4 Pro",
    category: "electronics",
    globalPrice: 499,
    localPrice: 1250,
    country: "USA",
    risk: "Low",
    image: "🥽",
    description:
      "Yeni nesil karma gerçeklik başlığı. Yüksek çözünürlüklü lensler ve gelişmiş el takibi.",
    specs: [
      "2K per eye resolution",
      "Passthrough support",
      "Snapdragon XR3 Chip",
    ],
    raw: { price: 499, globalPrice: 499, localPrice: 1250 },
  },
  {
    id: "seed_2",
    name: "North Face 1996 Retro Nuptse",
    category: "fashion",
    globalPrice: 280,
    localPrice: 750,
    country: "UK",
    risk: "Low",
    image: "🧥",
    description:
      "Klasik retro tasarım, su geçirmez kumaş ve kaz tüyü dolgu ile maksimum sıcaklık.",
    specs: ["700-fill down", "Stowable hood", "Ripstop fabric"],
    raw: { price: 280, globalPrice: 280, localPrice: 750 },
  },
  {
    id: "seed_3",
    name: "Keychron Q6 Max Mechanical Keyboard",
    category: "electronics",
    globalPrice: 180,
    localPrice: 480,
    country: "China",
    risk: "Low",
    image: "⌨️",
    description:
      "Full-size premium mekanik klavye. Alüminyum gövde ve hot-swappable switch desteği.",
    specs: ["Gasket mount", "QMK/VIA support", "Bluetooth 5.1 & 2.4GHz"],
    raw: { price: 180, globalPrice: 180, localPrice: 480 },
  },
  {
    id: "seed_4",
    name: "Sony WH-1000XM6 Headphones",
    category: "electronics",
    globalPrice: 349,
    localPrice: 890,
    country: "Japan",
    risk: "Low",
    image: "🎧",
    description:
      "Sektör lideri gürültü engelleme ve yapay zeka destekli ses netliği.",
    specs: ["60h battery life", "Speak-to-chat", "Multi-point connection"],
    raw: { price: 349, globalPrice: 349, localPrice: 890 },
  },
  {
    id: "seed_5",
    name: "Creed Aventus Eau de Parfum",
    category: "fragrances",
    globalPrice: 320,
    localPrice: 950,
    country: "France",
    risk: "Low",
    image: "🧴",
    description:
      "Kültleşmiş meyvemsi ve odunsu notalar. Lüksün ve gücün simgesi.",
    specs: ["100ml Bottle", "Unisex classic", "Long lasting sillage"],
    raw: { price: 320, globalPrice: 320, localPrice: 950 },
  },
  {
    id: "seed_6",
    name: "Nike Jordan 4 Retro Military Blue",
    category: "fashion",
    globalPrice: 215,
    localPrice: 620,
    country: "USA",
    risk: "Low",
    image: "👟",
    description:
      "İkonik Jordan serisinin en sevilen renklerinden biri. Premium deri işçiliği.",
    specs: ["Classic silhouette", "Air-sole unit", "OG colorway"],
    raw: { price: 215, globalPrice: 215, localPrice: 620 },
  },
  {
    id: "seed_7",
    name: "DJI Mini 5 Pro Drone",
    category: "electronics",
    globalPrice: 750,
    localPrice: 1850,
    country: "China",
    risk: "Low",
    image: "🚁",
    description:
      "249 gram altı, ehliyet gerektirmeyen profesyonel çekim drone'u.",
    specs: ["4K/60fps HDR", "Obstacle sensing", "Vertical shooting"],
    raw: { price: 750, globalPrice: 750, localPrice: 1850 },
  },
  {
    id: "seed_8",
    name: "Apple Watch Ultra 3",
    category: "electronics",
    globalPrice: 799,
    localPrice: 1950,
    country: "USA",
    risk: "Low",
    image: "⌚",
    description:
      "Ekstrem sporlar için dayanıklı titanyum kasa ve en parlak ekran teknolojisi.",
    specs: ["Titanium Case", "Dual-frequency GPS", "36h battery life"],
    raw: { price: 799, globalPrice: 799, localPrice: 1950 },
  },
  {
    id: "seed_9",
    name: "Tom Ford Lost Cherry (50ml)",
    category: "fragrances",
    globalPrice: 250,
    localPrice: 720,
    country: "USA",
    risk: "Low",
    image: "🍷",
    description:
      "Tatlı ve ekşi notaların mükemmel uyumu. Gurme bir parfüm deneyimi.",
    specs: [
      "Luxury private blend",
      "Cherry & Almond notes",
      "Iconic bottle design",
    ],
    raw: { price: 250, globalPrice: 250, localPrice: 720 },
  },
  {
    id: "seed_10",
    name: "Anker 737 Power Bank (PowerCore 24K)",
    category: "accessories",
    globalPrice: 140,
    localPrice: 380,
    country: "Germany",
    risk: "Low",
    image: "🔋",
    description:
      "140W hızlı şarj desteği olan akıllı ekranlı yüksek kapasiteli taşınabilir şarj cihazı.",
    specs: ["24,000mAh", "Smart digital display", "PD 3.1 support"],
    raw: { price: 140, globalPrice: 140, localPrice: 380 },
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
    } catch (err) {}
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
