import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  Upload,
  Package,
  DollarSign,
  Globe,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/seller");
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
            Back to Seller Dashboard
          </Link>
          <h1 className="text-3xl text-[var(--navy)]">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-600 mt-2">
            List your product for global cross-border sales
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl text-[var(--navy)] mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-[var(--electric-blue)]" />
              <span>Product Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                  placeholder="Premium Wireless Headphones"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                  <Barcode className="w-4 h-4" />
                  Global EAN / Barcode
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
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                >
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Garden</option>
                  <option value="toys">Toys & Games</option>
                  <option value="sports">Sports & Outdoors</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] resize-none"
                  rows={4}
                  placeholder="Detailed product description..."
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price (USD)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                  placeholder="299.99"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Stock Quantity
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
                <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Country of Origin
                </label>
                <select
                  value={formData.origin}
                  onChange={(e) => updateField("origin", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                >
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Japan">Japan</option>
                  <option value="China">China</option>
                  <option value="South Korea">South Korea</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl text-[var(--navy)] mb-6 flex items-center gap-2">
              <Weight className="w-6 h-6 text-[var(--electric-blue)]" />
              <span>Shipping Dimensions & Weight</span>
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Accurate dimensions are critical for customs and shipping cost
              calculations
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Weight (kg)
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
                  <Ruler className="w-4 h-4" />
                  Length (cm)
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
                  Width (cm)
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
                  Height (cm)
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
              <span>Product Media</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block mb-3 text-sm text-gray-700">
                  Product Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-[var(--electric-blue)] transition-colors cursor-pointer bg-gray-50"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">
                        Upload Image {i}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Recommended: 1200x1200px, JPG or PNG
                </p>
              </div>

              <div>
                <label className="block mb-3 text-sm text-gray-700">
                  3D Model Upload{" "}
                  <span className="text-[var(--electric-blue)]">
                    (Optional)
                  </span>
                </label>
                <div className="border-2 border-dashed border-[var(--electric-blue)] rounded-xl p-8 text-center bg-blue-50">
                  <div className="w-16 h-16 bg-[var(--electric-blue)] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg text-[var(--navy)] mb-2">
                    Upload 3D Model
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Provide an interactive 3D view for better customer
                    engagement
                  </p>
                  <button
                    type="button"
                    className="px-6 py-3 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors"
                  >
                    Choose GLB/GLTF File
                  </button>
                  <p className="text-xs text-gray-500 mt-3">
                    Supported formats: GLB, GLTF (Max 10MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-[var(--electric-blue)] text-white py-4 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-lg"
            >
              {isEdit ? "Update Product" : "Publish Product"}
            </button>
            <Link
              to="/seller"
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-lg"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
