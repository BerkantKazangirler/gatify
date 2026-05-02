import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Package,
  Clock,
  TrendingDown,
  CheckCircle,
  Plane,
  Ship,
  LogIn,
} from "lucide-react";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<"air" | "sea">(
    "air",
  );
  const [rotate3D, setRotate3D] = useState(0);

  const product = {
    id: 1,
    name: "Sony WH-1000XM5 Headphones",
    category: "Electronics",
    globalPrice: 299,
    localPrice: 449,
    country: "USA",
    risk: "Low",
    image: "🎧",
    description:
      "Industry-leading noise cancellation with premium sound quality and all-day comfort.",
    specs: [
      "30 hour battery life",
      "Multi-point connection",
      "Speak-to-chat technology",
      "Premium build quality",
    ],
  };

  const shipping = {
    air: { days: 5, cost: 35, customsDays: 2 },
    sea: { days: 21, cost: 15, customsDays: 3 },
  };

  const selected = shipping[selectedShipping];
  const basePrice = product.globalPrice;
  const shippingCost = selected.cost;
  const customsTax = Math.round(basePrice * 0.18);
  const vat = Math.round((basePrice + customsTax) * 0.15);
  const totalPrice = basePrice + shippingCost + customsTax + vat;
  const totalSavings = product.localPrice - totalPrice;
  const worthItScore = Math.round((totalSavings / product.localPrice) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/products"
            className="flex items-center gap-2 text-[var(--electric-blue)] hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div
              className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-9xl cursor-grab active:cursor-grabbing select-none border-4 border-white shadow-xl overflow-hidden"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const rotation = (x / rect.width) * 360 - 180;
                setRotate3D(rotation);
              }}
              style={{
                transform: `perspective(1000px) rotateY(${rotate3D}deg)`,
              }}
            >
              <div style={{ transform: `rotateY(${-rotate3D}deg)` }}>
                {product.image}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Drag or move mouse to rotate 3D view</span>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl text-[var(--navy)]">{product.name}</h1>
                <span
                  className={`px-4 py-2 rounded-xl text-sm ${
                    product.risk === "Low"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {product.risk} Customs Risk
                </span>
              </div>
              <p className="text-gray-600 mb-4">{product.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Ships from {product.country}
                </span>
                <span>•</span>
                <span>{product.category}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-lg text-[var(--navy)] mb-4">
                Product Highlights
              </h3>
              <ul className="space-y-3">
                {product.specs.map((spec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[var(--navy)] to-[var(--navy-light)] rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Worth It? Score</h3>
                <div className="text-4xl">
                  {worthItScore >= 70 ? "✅" : "⚠️"}
                </div>
              </div>
              <div className="text-5xl mb-2">{worthItScore}%</div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full ${worthItScore >= 70 ? "bg-green-400" : "bg-yellow-400"}`}
                  style={{ width: `${worthItScore}%` }}
                />
              </div>
              <p className="text-sm text-gray-300">
                {worthItScore >= 70
                  ? "Excellent deal! Significant savings even with all fees included."
                  : "Good deal, but shipping and customs reduce savings."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg text-[var(--navy)] mb-4">
              Shipping Simulation
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setSelectedShipping("air")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedShipping === "air"
                    ? "border-[var(--electric-blue)] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <Plane className="w-8 h-8 text-[var(--electric-blue)]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Air Freight</div>
                  <div className="text-lg text-[var(--navy)]">
                    {shipping.air.days} days
                  </div>
                  <div className="text-sm text-gray-500">
                    ${shipping.air.cost}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedShipping("sea")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedShipping === "sea"
                    ? "border-[var(--electric-blue)] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <Ship className="w-8 h-8 text-[var(--electric-blue)]" />
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Sea Freight</div>
                  <div className="text-lg text-[var(--navy)]">
                    {shipping.sea.days} days
                  </div>
                  <div className="text-sm text-gray-500">
                    ${shipping.sea.cost}
                  </div>
                </div>
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <div className="mb-1">
                  Estimated customs clearance:{" "}
                  <span className="font-medium">
                    {selected.customsDays} days
                  </span>
                </div>
                <div className="text-xs text-yellow-700">
                  Total delivery: {selected.days + selected.customsDays} days
                  from purchase
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg text-[var(--navy)] mb-4">
              Dynamic Tax Breakdown
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Base Price</span>
                <span className="text-lg text-[var(--navy)]">${basePrice}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">
                  Shipping ({selectedShipping === "air" ? "Air" : "Sea"})
                </span>
                <span className="text-lg text-[var(--navy)]">
                  ${shippingCost}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Customs Tax (18%)</span>
                <span className="text-lg text-[var(--navy)]">
                  ${customsTax}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">VAT (15%)</span>
                <span className="text-lg text-[var(--navy)]">${vat}</span>
              </div>

              <div className="flex items-center justify-between py-3 bg-gray-50 rounded-xl px-4">
                <span className="text-lg text-[var(--navy)]">Total Cost</span>
                <span className="text-2xl text-[var(--navy)]">
                  ${totalPrice}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 bg-green-50 rounded-xl px-4">
                <span className="flex items-center gap-2 text-green-700">
                  <TrendingDown className="w-5 h-5" />
                  <span>You Save</span>
                </span>
                <span className="text-2xl text-green-700">${totalSavings}</span>
              </div>
            </div>

            {isLoggedIn ? (
              <button
                onClick={() => navigate(`/checkout/${id}`)}
                className="w-full bg-[var(--electric-blue)] text-white py-4 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-lg"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/register"
                  className="w-full bg-[var(--electric-blue)] text-white py-4 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-lg flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In to Purchase</span>
                </Link>
                <p className="text-center text-sm text-gray-600">
                  Create a free account to unlock checkout and customs
                  automation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
