import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Filter, MapPin, TrendingDown, Search, X } from "lucide-react";
import { fetchAllProducts } from "../utils/firestoreHelpers";

export function ProductDiscovery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const items = await fetchAllProducts();
        if (mounted) setProductsList(items);
      } catch (e: any) {
        console.error(e);
        if (mounted) setError(e.message || "Failed to fetch products");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const syncLocalSamples = async () => {
    for (const p of products) {
      const payload = {
        name: p.name,
        price: p.globalPrice,
        localPrice: p.localPrice,
        origin: p.country,
        photo: p.image,
        stock: p.stock ?? 10,
        salerId: "salerTest",
        categoryId: p.category,
        description: p.description ?? "",
      };
      try {
        await saveProduct(payload);
      } catch (err) {
        console.error("sync failed", err);
      }
    }
    const items = await fetchAllProducts();
    setProductsList(items);
  };

  const filteredProducts = productsList.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesRisk = selectedRisk === "All" || product.risk === selectedRisk;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPrice =
      product.globalPrice >= minPrice && product.globalPrice <= maxPrice;
    return matchesCategory && matchesRisk && matchesSearch && matchesPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Ürünler yükleniyor…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.globalPrice - b.globalPrice;
      case "price-high":
        return b.globalPrice - a.globalPrice;
      case "savings":
        return b.savingsPercent - a.savingsPercent;
      default:
        return 0;
    }
  });

  const categories = [
    { value: "All", label: "Tümü" },
    { value: "Electronics", label: "Elektronik" },
    { value: "Fashion", label: "Moda" },
    { value: "Home", label: "Ev" },
    { value: "Toys", label: "Oyuncak" },
  ];
  const riskLevels = [
    { value: "All", label: "Tümü" },
    { value: "Low", label: "Düşük" },
    { value: "Medium", label: "Orta" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-space-grotesk text-foreground mb-1">
                  Küresel Ürünler
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gümrük otomasyonu ve fiyat avantajı içgörüleriyle ürünleri
                  keşfet
                </p>
              </div>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary"
              >
                <Filter className="w-5 h-5" />
                Filtreler
              </button>
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-secondary text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Ürün ara..."
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={syncLocalSamples}
                className="hidden md:inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-secondary"
              >
                Örnekleri eşitle
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Filters */}
        <aside
          className={`fixed md:static inset-0 md:inset-auto w-64 bg-white border-r border-border overflow-y-auto transition-all duration-300 z-30 md:z-0 ${
            showMobileFilters
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6 md:mb-0">
              <h2 className="text-lg font-space-grotesk text-foreground">
                Filtreler
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-foreground mb-3">
                Kategori
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat.value}
                    className="flex items-center gap-3 cursor-pointer hover:bg-secondary p-2 rounded"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={selectedCategory === cat.value}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 accent-accent"
                    />
                    <span className="text-sm text-foreground">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Risk Level Filter */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-foreground mb-3">
                Gümrük Riski
              </h3>
              <div className="space-y-2">
                {riskLevels.map((risk) => (
                  <label
                    key={risk.value}
                    className="flex items-center gap-3 cursor-pointer hover:bg-secondary p-2 rounded"
                  >
                    <input
                      type="radio"
                      name="risk"
                      value={risk.value}
                      checked={selectedRisk === risk.value}
                      onChange={(e) => setSelectedRisk(e.target.value)}
                      className="w-4 h-4 accent-accent"
                    />
                    <span className="text-sm text-foreground">
                      {risk.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-foreground mb-4">
                Fiyat Aralığı
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Min</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Max</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(parseInt(e.target.value) || 5000)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedRisk("All");
                setMinPrice(0);
                setMaxPrice(5000);
              }}
              className="w-full px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Sort and Count */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {sortedProducts.length} ürün
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="relevance">Alaka düzeyi</option>
                  <option value="price-low">Fiyat: düşükten yükseğe</option>
                  <option value="price-high">Fiyat: yüksekten düşüğe</option>
                  <option value="savings">En iyi tasarruf</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {sortedProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group h-full"
                  >
                    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-accent transition-all duration-300 h-full flex flex-col">
                      {/* Image */}
                      <div className="aspect-square bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-5xl md:text-6xl group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                        {product.image}
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col flex-1">
                        {/* Category Badge */}
                        <span className="inline-block w-fit px-2 py-1 mb-2 bg-secondary text-accent text-xs rounded-full">
                          {product.category}
                        </span>

                        {/* Title */}
                        <h3 className="font-medium text-card-foreground line-clamp-2 mb-2 group-hover:text-accent transition-colors min-h-[2.5rem]">
                          {product.name}
                        </h3>

                        {/* Rating and Country */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <MapPin className="w-3 h-3" />
                          <span>{product.country}</span>
                          <span
                            className={`ml-auto px-2 py-1 rounded-full font-medium ${
                              product.risk === "Low"
                                ? "bg-success/20 text-success"
                                : "bg-warning/20 text-warning"
                            }`}
                          >
                            {product.risk} risk
                          </span>
                        </div>

                        {/* Prices */}
                        <div className="space-y-2 py-3 border-t border-b border-border mb-3">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-muted-foreground">
                              Küresel
                            </span>
                            <span className="text-lg font-medium text-accent">
                              ${product.globalPrice}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-muted-foreground">
                              Yerel
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.localPrice}
                            </span>
                          </div>
                        </div>

                        {/* Savings */}
                        <div className="flex items-center justify-between mt-auto">
                          <span className="flex items-center gap-1 text-success text-sm font-medium">
                            <TrendingDown className="w-4 h-4" />$
                            {product.savings} tasarruf
                          </span>
                          <span className="text-lg font-bold text-success">
                            {product.savingsPercent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-space-grotesk text-foreground mb-2">
                  Ürün bulunamadı
                </h3>
                <p className="text-muted-foreground">
                  Filtrelerini veya arama terimini değiştir
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setShowMobileFilters(false)}
        />
      )}
    </div>
  );
}
