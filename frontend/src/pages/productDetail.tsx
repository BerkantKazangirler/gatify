import { useState, useEffect } from "react";
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
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeView, setActiveView] = useState<"image" | "3d">("image");
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { fetchProductById } = await import("../utils/firestoreHelpers");
        const p = await fetchProductById(id as string);
        if (mounted) {
          if (!p) setError("Ürün bulunamadı");
          setProduct(p as any);
        }
      } catch (e: any) {
        console.error(e);
        if (mounted) setError(e.message || "Ürün yüklenemedi");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Ürün yükleniyor…</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error ?? "Ürün bulunamadı"}</div>
      </div>
    );
  }

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

  // Görselleri hazırlarız; API'den gelen dizi (images) yoksa default image kullanıp dizi oluşturur.
  const productImages = product.images?.length
    ? product.images
    : [product.image];
  // 3B model desteğini Firestore verisinden veya raw içinden algıla
  const has3DModel = product.model3d || product.raw?.model3D || product.has3d;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/products"
            className="flex items-center gap-2 text-[var(--electric-blue)] hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Ürünlere Dön
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
              {activeView === "3d" ? (
                <div
                  className="w-full h-full flex items-center justify-center text-9xl cursor-grab active:cursor-grabbing select-none"
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
              ) : (
                <div className="w-full h-full flex items-center justify-center text-9xl">
                  {String(productImages[activeMediaIndex]).startsWith(
                    "http",
                  ) ? (
                    <img
                      src={productImages[activeMediaIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{productImages[activeMediaIndex]}</span>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery (Sahibinden tarzı slider) */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {productImages.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveView("image");
                    setActiveMediaIndex(idx);
                  }}
                  className={`relative w-20 h-20 flex-shrink-0 flex items-center justify-center text-3xl bg-white rounded-lg border-2 transition-all overflow-hidden cursor-pointer
                    ${activeView === "image" && activeMediaIndex === idx ? "border-[var(--electric-blue)] shadow-md" : "border-gray-200 hover:border-gray-300"}
                  `}
                >
                  {String(img).startsWith("http") ? (
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{img}</span>
                  )}
                </button>
              ))}

              {/* 3D Model Tab */}
              {has3DModel && (
                <button
                  onClick={() => setActiveView("3d")}
                  className={`relative w-20 h-20 flex-shrink-0 flex flex-col items-center justify-center bg-white rounded-lg border-2 transition-all cursor-pointer
                    ${activeView === "3d" ? "border-[var(--electric-blue)] shadow-md bg-blue-50" : "border-gray-200 hover:border-gray-300"}
                  `}
                >
                  <Package
                    className={`w-8 h-8 ${activeView === "3d" ? "text-[var(--electric-blue)]" : "text-gray-400"}`}
                  />
                  <span
                    className={`text-[10px] font-medium mt-1 ${activeView === "3d" ? "text-[var(--electric-blue)]" : "text-gray-500"}`}
                  >
                    3B Model
                  </span>
                </button>
              )}
            </div>

            {/* Hint Message for 3D View */}
            {activeView === "3d" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 animate-in fade-in">
                <p className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>
                    3B görünümü döndürmek için sürükle ya da fareyi hareket
                    ettir
                  </span>
                </p>
              </div>
            )}
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
                  {product.risk} gümrük riski
                </span>
              </div>
              <p className="text-gray-600 mb-4">{product.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {product.country} çıkışlı
                </span>
                <span>•</span>
                <span>{product.category}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-lg text-[var(--navy)] mb-4">
                Ürün Öne Çıkanları
              </h3>
              <ul className="space-y-3">
                {(product.specs || product.raw?.specs || []).map(
                  (spec: any, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{spec}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[var(--navy)] to-[var(--navy-light)] rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Değer mi? Skoru</h3>
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
                  ? "Harika fırsat! Tüm masraflar dahil olsa bile ciddi tasarruf."
                  : "İyi fırsat, ancak kargo ve gümrük tasarrufu azaltıyor."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg text-[var(--navy)] mb-4">
              Gönderim Simülasyonu
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
                  <div className="text-sm text-gray-600">Hava Kargosu</div>
                  <div className="text-lg text-[var(--navy)]">
                    {shipping.air.days} gün
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
                  <div className="text-sm text-gray-600">Deniz Kargosu</div>
                  <div className="text-lg text-[var(--navy)]">
                    {shipping.sea.days} gün
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
                  Tahmini gümrük işlemi:{" "}
                  <span className="font-medium">
                    {selected.customsDays} gün
                  </span>
                </div>
                <div className="text-xs text-yellow-700">
                  Toplam teslimat: satın almadan itibaren{" "}
                  {selected.days + selected.customsDays} gün
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg text-[var(--navy)] mb-4">
              Dinamik Vergi Dağılımı
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Baz Fiyat</span>
                <span className="text-lg text-[var(--navy)]">${basePrice}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">
                  Kargo ({selectedShipping === "air" ? "Hava" : "Deniz"})
                </span>
                <span className="text-lg text-[var(--navy)]">
                  ${shippingCost}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Gümrük Vergisi (%18)</span>
                <span className="text-lg text-[var(--navy)]">
                  ${customsTax}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">KDV (%15)</span>
                <span className="text-lg text-[var(--navy)]">${vat}</span>
              </div>

              <div className="flex items-center justify-between py-3 bg-gray-50 rounded-xl px-4">
                <span className="text-lg text-[var(--navy)]">
                  Toplam Maliyet
                </span>
                <span className="text-2xl text-[var(--navy)]">
                  ${totalPrice}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 bg-green-50 rounded-xl px-4">
                <span className="flex items-center gap-2 text-green-700">
                  <TrendingDown className="w-5 h-5" />
                  <span>Sen Kazanıyorsun</span>
                </span>
                <span className="text-2xl text-green-700">${totalSavings}</span>
              </div>
            </div>

            {isLoggedIn ? (
              <button
                onClick={() => navigate(`/checkout/${id}`)}
                className="w-full bg-[var(--electric-blue)] text-white py-4 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-lg"
              >
                Ödemeye Geç
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/register"
                  className="w-full bg-[var(--electric-blue)] text-white py-4 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-lg flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Satın almak için giriş yap</span>
                </Link>
                <p className="text-center text-sm text-gray-600">
                  Ödeme ve gümrük otomasyonunu açmak için ücretsiz hesap oluştur
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
