import { useState, useEffect } from "react";
import { Link } from "react-router";
import { fetchAllProducts } from "../utils/firestoreHelpers";
import {
  Search,
  TrendingDown,
  Globe,
  Shield,
  Zap,
  Package,
  ArrowRight,
  Star,
} from "lucide-react";

const featuredDeals: any[] = [];

const features: Array<{
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "green" | "blue" | "yellow" | "purple";
}> = [
  {
    icon: <TrendingDown className="w-8 h-8" />,
    title: "Price Arbitrage",
    description: "Save 20-40% vs local prices",
    color: "green",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Customs Simplified",
    description: "Automated declaration & clearance",
    color: "blue",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Fast Tracking",
    description: "Real-time updates & crisis alerts",
    color: "yellow",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Global Marketplace",
    description: "Shop from 150+ countries",
    color: "purple",
  },
];

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deals, setDeals] = useState<any[]>(featuredDeals);

  useEffect(() => {
    fetchAllProducts()
      .then((products) => {
        // Map backend products to match frontend featured deal card requirements
        if (products && products.length > 0) {
          const dynamicDeals = products.map((p) => {
            const lp = p.localPrice || p.globalPrice * 1.3; // fallback local price
            const savings =
              lp > 0 ? Math.round(((lp - p.globalPrice) / lp) * 100) : 0;
            return {
              id: p.id,
              name: p.name,
              category: p.category,
              globalPrice: p.globalPrice,
              localPrice: lp,
              savings: savings,
              country: p.country || "Global",
              rating: 5.0,
              image: p.image || "📦",
            };
          });
          setDeals(dynamicDeals.slice(0, 6)); // Show top 6 deals
        }
      })
      .catch((err) => console.error("Could not fetch real products:", err));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-[var(--navy)] via-[var(--navy-light)] to-[var(--electric-blue)] text-white">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Package className="w-4 h-4" />
              <span className="text-sm">Sınır ötesi ticaret platformu</span>
            </div>
            <h1 className="text-5xl md:text-6xl mb-6">
              Küresel alışveriş yap,
              <br />
              <span className="text-[var(--electric-blue-light)]">
                büyük tasarruf et
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Dünya genelinde fiyat karşılaştır, gümrük işlemlerini
              otomatikleştir ve premium ürünlerde %40'a kadar tasarruf et.
            </p>

            <div className="relative max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 rounded-xl bg-white text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-[var(--electric-blue)] shadow-2xl"
                placeholder="Dünyadaki ürünleri ara..."
              />
              <Link
                to="/products"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors"
              >
                Keşfet
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <span className="text-sm text-gray-300">Popüler:</span>
              <button className="px-4 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors">
                Elektronik
              </button>
              <button className="px-4 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors">
                Moda
              </button>
              <button className="px-4 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors">
                Ev & Bahçe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl text-[var(--navy)] mb-2">
                🔥 Trend Olan Küresel Fırsatlar
              </h2>
              <p className="text-gray-600">
                Bu haftanın en iyi fiyat avantajı fırsatları
              </p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-2 px-6 py-3 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors"
            >
              <span>Tümünü Gör</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-[var(--electric-blue)] hover:shadow-xl transition-all group"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-7xl">
                  {product.image}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm text-gray-700">
                        {product.rating}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg text-[var(--navy)] mb-3 line-clamp-2 group-hover:text-[var(--electric-blue)] transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-2xl text-[var(--electric-blue)]">
                      ${product.globalPrice}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${product.localPrice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      {product.country} çıkışlı
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      -{product.savings}%
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[var(--navy)] to-[var(--electric-blue)] rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl mb-4">Tasarrufa başlamaya hazır mısın?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Küresel fiyat karşılaştırma ve otomatik gümrük ile her alışverişte
            tasarruf eden binlerce akıllı alışverişçiye katıl.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-[var(--navy)] rounded-xl hover:bg-gray-100 transition-colors text-lg"
            >
              Ücretsiz Hesap Oluştur
            </Link>
            <Link
              to="/help"
              className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors text-lg border border-white/30"
            >
              Daha Fazla Bilgi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "green" | "blue" | "yellow" | "purple";
}) {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div
        className={`w-16 h-16 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-lg text-[var(--navy)] mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
