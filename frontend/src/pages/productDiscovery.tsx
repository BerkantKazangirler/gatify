import { useState } from "react";
import { Link } from "react-router";
import { Filter, MapPin, TrendingDown, Search } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Headphones",
    category: "Electronics",
    globalPrice: 299,
    localPrice: 449,
    savings: 150,
    savingsPercent: 33,
    country: "USA",
    risk: "Low",
    image: "🎧",
  },
  {
    id: 2,
    name: "Dyson V15 Detect Vacuum",
    category: "Home",
    globalPrice: 549,
    localPrice: 799,
    savings: 250,
    savingsPercent: 31,
    country: "UK",
    risk: "Low",
    image: "🧹",
  },
  {
    id: 3,
    name: "Apple AirPods Pro 2",
    category: "Electronics",
    globalPrice: 189,
    localPrice: 279,
    savings: 90,
    savingsPercent: 32,
    country: "Japan",
    risk: "Medium",
    image: "🎵",
  },
  {
    id: 4,
    name: "Lego Millennium Falcon",
    category: "Toys",
    globalPrice: 849,
    localPrice: 1199,
    savings: 350,
    savingsPercent: 29,
    country: "Germany",
    risk: "Low",
    image: "🚀",
  },
  {
    id: 5,
    name: "Nike Air Max 2024",
    category: "Fashion",
    globalPrice: 159,
    localPrice: 229,
    savings: 70,
    savingsPercent: 31,
    country: "Vietnam",
    risk: "Low",
    image: "👟",
  },
  {
    id: 6,
    name: "Samsung Galaxy S24 Ultra",
    category: "Electronics",
    globalPrice: 1099,
    localPrice: 1499,
    savings: 400,
    savingsPercent: 27,
    country: "South Korea",
    risk: "Medium",
    image: "📱",
  },
  {
    id: 7,
    name: "KitchenAid Stand Mixer",
    category: "Home",
    globalPrice: 379,
    localPrice: 549,
    savings: 170,
    savingsPercent: 31,
    country: "USA",
    risk: "Low",
    image: "🍰",
  },
  {
    id: 8,
    name: "Canon EOS R6 Mark II",
    category: "Electronics",
    globalPrice: 2399,
    localPrice: 3199,
    savings: 800,
    savingsPercent: 25,
    country: "Japan",
    risk: "Medium",
    image: "📷",
  },
];

export function ProductDiscovery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesRisk = selectedRisk === "All" || product.risk === selectedRisk;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRisk && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl text-[var(--navy)] mb-4">
            Discover Global Products
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] focus:border-transparent"
                placeholder="Search products..."
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home & Garden</option>
              <option value="Toys">Toys & Games</option>
            </select>

            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Customs Risk</option>
              <option value="Medium">Medium Risk</option>
            </select>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {filteredProducts.length} products found
            </span>
            <span>•</span>
            <span>Average savings: 30%</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[var(--electric-blue)] hover:shadow-xl transition-all group"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
                {product.image}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="flex-1 text-[var(--navy)] line-clamp-2 group-hover:text-[var(--electric-blue)] transition-colors">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{product.country}</span>
                  <span
                    className={`ml-auto px-2 py-1 rounded-full ${
                      product.risk === "Low"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {product.risk} Risk
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-gray-500">Global Price</span>
                    <span className="text-xl text-[var(--electric-blue)]">
                      ${product.globalPrice}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-gray-500">Local Price</span>
                    <span className="text-sm text-gray-400 line-through">
                      ${product.localPrice}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-green-600">
                        <TrendingDown className="w-4 h-4" />
                        <span>Save ${product.savings}</span>
                      </span>
                      <span className="text-lg text-green-600">
                        {product.savingsPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
