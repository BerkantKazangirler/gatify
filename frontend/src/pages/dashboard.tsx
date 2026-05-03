import { Search, TrendingDown, Package, MapPin, Clock, DollarSign, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { fetchAllProducts } from "../utils/firestoreHelpers";
import { useAuth } from "../context/AuthContext";

const activeShipments = [
  {
    id: 1,
    product: 'MacBook Pro 16"',
    status: "In Transit",
    location: "Singapore Port",
    eta: "2 days",
    progress: 60,
  },
  {
    id: 2,
    product: "Nintendo Switch OLED",
    status: "Customs Clearance",
    location: "Local Customs",
    eta: "1 day",
    progress: 85,
  },
  {
    id: 3,
    product: "Bose QuietComfort 45",
    status: "Preparing Shipment",
    location: "USA Warehouse",
    eta: "5 days",
    progress: 20,
  },
];

export function Dashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [arbitrageDeals, setArbitrageDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAllProducts()
      .then((products) => {
        if (products && products.length > 0) {
          const dynamicDeals = products.map((p) => {
            const lp = p.localPrice || p.globalPrice * 1.3;
            const savings =
              lp > 0 ? Math.round(((lp - p.globalPrice) / lp) * 100) : 0;
            return {
              id: p.id,
              product: p.name,
              globalPrice: p.globalPrice,
              localPrice: lp,
              savings: lp - p.globalPrice,
              savingsPercent: savings,
              country: p.country || "Global",
              risk: p.risk || "Low",
            };
          });
          setArbitrageDeals(dynamicDeals.slice(0, 4));
        }
      })
      .catch((err) => console.error("API error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Greeting by time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[var(--navy)] to-[var(--navy-light)] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl mb-2">
            {greeting}
            {user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
          </h1>
          <p className="text-gray-300 mb-6">
            Küresel fırsatları keşfet ve gönderilerini takip et
          </p>

          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-xl bg-white text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] shadow-lg"
              placeholder="Dünyadaki ürünleri ara (ör. iPhone 15, Nike Air Max)"
            />
          </div>

          <div className="flex gap-4 mt-4">
            {["Elektronik", "Moda", "Ev & Bahçe", "Spor"].map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<TrendingDown className="w-6 h-6" />}
            label="Ortalama Tasarruf"
            value="32%"
            description="yerel fiyatlara göre"
            color="green"
          />
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label="Aktif Gönderiler"
            value="3"
            description="2 bu hafta geliyor"
            color="blue"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Toplam Tasarruf"
            value="$1,247"
            description="Son 6 ay"
            color="purple"
          />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-[var(--navy)]">
              🔥 En İyi Fiyat Avantajı Fırsatları
            </h2>
            <Link
              to="/products"
              className="text-[var(--electric-blue)] hover:underline flex items-center gap-1"
            >
              Tümünü Gör <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse"
                >
                  <div className="h-5 bg-gray-200 rounded mb-3 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/2" />
                  <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : arbitrageDeals.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center text-gray-500">
              Ürün bulunamadı. Lütfen backend'in çalıştığından emin olun.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {arbitrageDeals.map((deal) => (
                <Link
                  key={deal.id}
                  to={`/products/${deal.id}`}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[var(--electric-blue)] hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="flex-1 text-[var(--navy)]">
                      {deal.product}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        deal.risk === "Low"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {deal.risk} Risk
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{deal.country} çıkışlı</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Küresel Fiyat
                      </div>
                      <div className="text-2xl text-[var(--electric-blue)]">
                        ${deal.globalPrice}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 line-through">
                        ${Math.round(deal.localPrice)}
                      </div>
                      <div className="text-lg text-green-600">
                        ${Math.round(deal.savings)} tasarruf (
                        {deal.savingsPercent}%)
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-[var(--navy)]">Aktif Gönderiler</h2>
            <Link
              to="/tracking"
              className="text-[var(--electric-blue)] hover:underline flex items-center gap-1"
            >
              Tümünü Takip Et <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {activeShipments.map((shipment, index) => (
              <div
                key={shipment.id}
                className={`p-6 ${index !== activeShipments.length - 1 ? "border-b border-gray-200" : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg text-[var(--navy)] mb-1">
                      {shipment.product}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {shipment.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        ETA: {shipment.eta}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-xl text-sm ${
                      shipment.status === "Customs Clearance"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {shipment.status}
                  </span>
                </div>

                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--electric-blue)] rounded-full transition-all"
                      style={{ width: `${shipment.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {shipment.progress}% Tamamlandı
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  color: "green" | "blue" | "purple";
}) {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div
        className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-3xl text-[var(--navy)] mb-1">{value}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  );
}