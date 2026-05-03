import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchProductById, saveProduct } from "../utils/firestoreHelpers";
import {
  ArrowLeft,
  Upload,
  Package,
  DollarSign,
  Weight,
  Ruler,
  Barcode,
  Image as ImageIcon,
} from "lucide-react";

export function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    ean: "",
    category: "electronics",
    description: "",
    price: "",
    stock: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    origin: "USA",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      try {
        const p = await fetchProductById(id as string);
        if (!mounted || !p) return;
        setFormData({
          name: p.name || "",
          ean: p.sku || "",
          category: (p.category || "electronics").toLowerCase(),
          description: p.description || "",
          price: String(p.globalPrice ?? p.raw?.price ?? ""),
          stock: String(p.stock ?? 0),
          weight: String(p.raw?.weight ?? ""),
          length: String(p.raw?.length ?? ""),
          width: String(p.raw?.width ?? ""),
          height: String(p.raw?.height ?? ""),
          origin: String(p.country || p.raw?.origin || "USA"),
        });
      } catch (err) {
        console.error(err);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        name: formData.name,
        ean: formData.ean,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price as any) || 0,
        stock: parseInt(formData.stock as any) || 0,
        weight: parseFloat(formData.weight as any) || 0,
        length: parseFloat(formData.length as any) || 0,
        width: parseFloat(formData.width as any) || 0,
        height: parseFloat(formData.height as any) || 0,
        origin: formData.origin,
        salerId: "salerTest",
      };
      if (isEdit && id) payload.id = id;
      await saveProduct(payload);
      navigate("/seller");
    } catch (err) {
      console.error(err);
      alert("Ürün kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/seller"
            className="flex items-center gap-2 text-[var(--electric-blue)] hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Satıcı Paneline Dön
          </Link>
          <h1 className="text-3xl text-[var(--navy)]">
            {isEdit ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          </h1>
          <p className="text-gray-600 mt-2">
            Ürününüzü sınır ötesi satışlar için listeleyin
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl text-[var(--navy)] mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-[var(--electric-blue)]" />
              <span>Ürün Bilgileri</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Ürün Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                  placeholder="Örn: Premium Kablosuz Kulaklık"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                  <Barcode className="w-4 h-4" /> EAN / Barkod
                </label>
                <input
                  type="text"
                  value={formData.ean}
                  onChange={(e) => updateField("ean", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                  placeholder="5901234123457"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                >
                  <option value="electronics">Elektronik</option>
                  <option value="fashion">Moda</option>
                  <option value="home">Ev & Bahçe</option>
                  <option value="toys">Oyuncak ve Oyunlar</option>
                  <option value="sports">Spor ve Outdoor</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm text-gray-700">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] resize-none"
                  rows={4}
                  placeholder="Ürün açıklaması..."
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Fiyat (USD)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Stok Miktarı
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                  placeholder="100"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Menşe Ülke
                </label>
                <select
                  value={formData.origin}
                  onChange={(e) => updateField("origin", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                >
                  <option value="USA">Amerika Birleşik Devletleri</option>
                  <option value="UK">Birleşik Krallık</option>
                  <option value="Germany">Almanya</option>
                  <option value="Japan">Japonya</option>
                  <option value="China">Çin</option>
                  <option value="South Korea">Güney Kore</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl text-[var(--navy)] mb-6 flex items-center gap-2">
              <Weight className="w-6 h-6 text-[var(--electric-blue)]" />
              <span>Kargo Ölçüleri ve Ağırlık</span>
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Doğru ölçüler, gümrük ve kargo maliyetleri için gereklidir.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Ağırlık (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                  placeholder="0.5"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                  <Ruler className="w-4 h-4" /> Uzunluk (cm)
                </label>
                <input
                  type="number"
                  value={formData.length}
                  onChange={(e) => updateField("length", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                  placeholder="20"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Genişlik (cm)
                </label>
                <input
                  type="number"
                  value={formData.width}
                  onChange={(e) => updateField("width", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                  placeholder="15"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Yükseklik (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateField("height", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                  placeholder="8"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl text-[var(--navy)] mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-[var(--electric-blue)]" />
              <span>Ürün Medyası</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block mb-3 text-sm text-gray-700">
                  Ürün Görselleri
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-[var(--electric-blue)] transition-colors cursor-pointer bg-gray-50"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">
                        Görsel Yükle {i}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Önerilen: 1200x1200px, JPG veya PNG
                </p>
              </div>

              <div>
                <label className="block mb-3 text-sm text-gray-700">
                  3B Model Yükle{" "}
                  <span className="text-[var(--electric-blue)]">
                    (İsteğe Bağlı)
                  </span>
                </label>
                <div className="border-2 border-dashed border-[var(--electric-blue)] rounded-xl p-8 text-center bg-blue-50">
                  <div className="w-16 h-16 bg-[var(--electric-blue)] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg text-[var(--navy)] mb-2">
                    3B Model Seç
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Etkileşimli 3B görünüm müşteri deneyimini artırır
                  </p>
                  <button
                    type="button"
                    className="px-6 py-3 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors"
                  >
                    GLB/GLTF Dosyası Seç
                  </button>
                  <p className="text-xs text-gray-500 mt-3">
                    Desteklenen formatlar: GLB, GLTF (Max 10MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[var(--electric-blue)] text-white py-4 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-lg disabled:opacity-60"
            >
              {saving
                ? isEdit
                  ? "Güncelleniyor…"
                  : "Yayınlanıyor…"
                : isEdit
                  ? "Ürünü Güncelle"
                  : "Ürünü Yayınla"}
            </button>
            <Link
              to="/seller"
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-lg"
            >
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
