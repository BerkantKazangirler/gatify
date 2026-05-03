import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  DollarSign,
  Package,
  TrendingUp,
  Globe,
  Plus,
  Edit,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  fetchAllProducts,
  fetchSellerDashboard,
} from "../utils/firestoreHelpers";

export function SellerDashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [topCountries, setTopCountries] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [showAllProductsDialog, setShowAllProductsDialog] = useState(false);

  const [sellerProducts, setSellerProducts] = useState<any[] | null>(null);
  const sellerId = "salerTest"; // kimlik doğrulama ile gelen satıcı id'si geldiğinde değiştir

  useEffect(() => {
    let mounted = true;
    const fetchSellerProducts = async () => {
      try {
        const items = await fetchAllProducts(sellerId);
        if (mounted) setSellerProducts(items);
      } catch (e) {
        console.error("Failed to fetch seller products", e);
        if (mounted) setSellerProducts([]);
      }
    };
    fetchSellerProducts();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadDashboard = async () => {
      try {
        const data = await fetchSellerDashboard(sellerId);
        if (!mounted) return;
        setTotalRevenue(data.totalRevenue ?? 0);
        setTotalOrders(data.totalOrders ?? 0);
        setActiveProducts(data.activeProducts ?? 0);
        setAvgOrderValue(data.avgOrderValue ?? 0);
        setSalesData(data.salesData ?? []);
        setTopCountries(data.topCountries ?? []);
        setRecentOrders(data.recentOrders ?? []);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      }
    };
    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-[var(--navy)] mb-2">
                Satıcı Paneli
              </h1>
              <p className="text-gray-600">
                Küresel envanterini ve dışa aktarım işlemlerini yönet
              </p>
            </div>
            <Link
              to="/seller/products/new"
              className="flex items-center gap-2 px-6 py-3 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Ürün Ekle</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Toplam Gelir"
            value={`$${totalRevenue.toLocaleString()}`}
            change=""
            color="green"
          />
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label="Toplam Sipariş"
            value={totalOrders.toString()}
            change=""
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Ortalama Sipariş Tutarı"
            value={`$${avgOrderValue}`}
            change=""
            color="purple"
          />
          <StatCard
            icon={<Globe className="w-6 h-6" />}
            label="Aktif Ürünler"
            value={activeProducts.toString()}
            change=""
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg text-[var(--navy)] mb-6">Gelir Eğilimi</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={{ fill: "#0ea5e9", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg text-[var(--navy)] mb-6">
              Aya Göre Siparişler
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="orders" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg text-[var(--navy)]">Ürün Envanteri</h3>
              <button
                type="button"
                onClick={() => setShowAllProductsDialog(true)}
                className="text-[var(--electric-blue)] hover:underline text-sm"
              >
                Tümünü Yönet
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">
                      Ürün
                    </th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">
                      Stok
                    </th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">
                      Fiyat
                    </th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">
                      Satış
                    </th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(sellerProducts ?? []).slice(0, 5).map((product) => {
                    const stockValue = product.stock ?? 0;
                    const status =
                      stockValue <= 0
                        ? "out_of_stock"
                        : stockValue < 20
                          ? "low_stock"
                          : "active";

                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-[var(--navy)]">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              SKU: {product.sku}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              status === "out_of_stock"
                                ? "bg-red-100 text-red-700"
                                : status === "low_stock"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {stockValue} adet
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[var(--navy)]">
                          ${product.globalPrice ?? product.price ?? 0}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {product.raw?.sales ?? 0} satıldı
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/seller/products/${product.id}/edit`}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Düzenle"
                            >
                              <Edit className="w-4 h-4 text-gray-600" />
                            </Link>
                            <Link
                              to={`/products/${product.id}`}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Görüntüle"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg text-[var(--navy)] mb-6">
              En Çok Gönderilen Ülkeler
            </h3>
            <div className="space-y-4">
              {topCountries.map((country, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[var(--navy)]">
                      {country.country}
                    </span>
                    <span className="text-sm text-gray-600">
                      ${country.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--electric-blue)] rounded-full"
                      style={{ width: `${(country.orders / 156) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {country.orders} sipariş
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg text-[var(--navy)]">
              Son Uluslararası Siparişler
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">
                    Sipariş No
                  </th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">
                    Ürün
                  </th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">
                    Varış Yeri
                  </th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-[var(--navy)]">{order.id}</td>
                    <td className="px-6 py-4 text-gray-700">{order.product}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.destination ?? order.country ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-[var(--navy)]">
                      ${order.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "shipped"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "customs"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAllProductsDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-xl text-[var(--navy)]">Tüm Ürünler</h3>
                <p className="text-sm text-gray-500">
                  {sellerProducts?.length ?? 0} ürün backend'den geliyor
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllProductsDialog(false)}
                className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Kapat
              </button>
            </div>

            <div className="max-h-[calc(90vh-73px)] overflow-auto p-6">
              {(sellerProducts ?? []).length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
                  Ürün bulunamadı.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">
                          Ürün
                        </th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">
                          Stok
                        </th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">
                          Fiyat
                        </th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">
                          Satış
                        </th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sellerProducts?.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-[var(--navy)]">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {product.category}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.sku}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.stock ?? 0}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--navy)]">
                            ${product.globalPrice ?? product.price ?? 0}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.raw?.sales ?? 0}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Link
                                to={`/seller/products/${product.id}/edit`}
                                className="rounded-lg p-2 hover:bg-gray-100"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4 text-gray-600" />
                              </Link>
                              <Link
                                to={`/products/${product.id}`}
                                className="rounded-lg p-2 hover:bg-gray-100"
                                title="View"
                              >
                                <Eye className="w-4 h-4 text-gray-600" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  color: "green" | "blue" | "purple" | "orange";
}) {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
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
      <div className="text-sm text-gray-500">{change}</div>
    </div>
  );
}
