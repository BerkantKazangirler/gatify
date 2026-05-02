import { Link } from "react-router";
import { DollarSign, Package, TrendingUp, Globe, Plus, Edit, Eye } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const salesData = [
  { month: "Jan", revenue: 12500, orders: 42 },
  { month: "Feb", revenue: 15800, orders: 53 },
  { month: "Mar", revenue: 18200, orders: 61 },
  { month: "Apr", revenue: 21500, orders: 72 },
  { month: "May", revenue: 19800, orders: 66 },
];

const topCountries = [
  { country: "USA", orders: 156, revenue: 45200 },
  { country: "Germany", orders: 98, revenue: 31500 },
  { country: "Japan", orders: 87, revenue: 28900 },
  { country: "UK", orders: 76, revenue: 24100 },
  { country: "Australia", orders: 64, revenue: 19800 },
];

const products = [
  { id: 1, name: "Premium Wireless Headphones", sku: "WHD-2024-PRO", stock: 156, price: 299, sales: 89, status: "active" },
  { id: 2, name: "Smart Home Assistant", sku: "SHA-2024-V2", stock: 234, price: 149, sales: 142, status: "active" },
  { id: 3, name: "Portable Power Bank 20000mAh", sku: "PPB-20K-BLK", stock: 12, price: 45, sales: 276, status: "low_stock" },
  { id: 4, name: "4K Action Camera", sku: "CAM-4K-PRO", stock: 67, price: 399, sales: 54, status: "active" },
  { id: 5, name: "Ergonomic Keyboard", sku: "KBD-ERG-2024", stock: 0, price: 129, sales: 198, status: "out_of_stock" },
];

const recentOrders = [
  { id: "ORD-2451", product: "Premium Wireless Headphones", country: "USA", amount: 299, status: "shipped", date: "May 2" },
  { id: "ORD-2450", product: "Smart Home Assistant", country: "Germany", amount: 149, status: "processing", date: "May 2" },
  { id: "ORD-2449", product: "Portable Power Bank", country: "Japan", amount: 45, status: "customs", date: "May 1" },
  { id: "ORD-2448", product: "4K Action Camera", country: "UK", amount: 399, status: "delivered", date: "May 1" },
];

export function SellerDashboard() {
  const totalRevenue = 87900;
  const totalOrders = 294;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-[var(--navy)] mb-2">Seller Dashboard</h1>
              <p className="text-gray-600">Manage your global inventory and export operations</p>
            </div>
            <Link
              to="/seller/products/new"
              className="flex items-center gap-2 px-6 py-3 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change="+12.5%"
            color="green"
          />
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label="Total Orders"
            value={totalOrders.toString()}
            change="+8.3%"
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Avg Order Value"
            value={`$${avgOrderValue}`}
            change="+5.2%"
            color="purple"
          />
          <StatCard
            icon={<Globe className="w-6 h-6" />}
            label="Active Products"
            value={activeProducts.toString()}
            change="2 low stock"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg text-[var(--navy)] mb-6">Revenue Trend</h3>
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
                <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: "#0ea5e9", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg text-[var(--navy)] mb-6">Orders by Month</h3>
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
              <h3 className="text-lg text-[var(--navy)]">Product Inventory</h3>
              <Link to="/seller/products/new" className="text-[var(--electric-blue)] hover:underline text-sm">
                Manage All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">Product</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">Stock</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">Price</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">Sales</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-[var(--navy)]">{product.name}</div>
                          <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            product.status === "out_of_stock"
                              ? "bg-red-100 text-red-700"
                              : product.status === "low_stock"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[var(--navy)]">${product.price}</td>
                      <td className="px-6 py-4 text-gray-600">{product.sales} sold</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/seller/products/${product.id}/edit`}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </Link>
                          <Link
                            to={`/products/${product.id}`}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg text-[var(--navy)] mb-6">Top Destinations</h3>
            <div className="space-y-4">
              {topCountries.map((country, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[var(--navy)]">{country.country}</span>
                    <span className="text-sm text-gray-600">${country.revenue.toLocaleString()}</span>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--electric-blue)] rounded-full"
                      style={{ width: `${(country.orders / 156) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{country.orders} orders</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg text-[var(--navy)]">Recent International Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Product</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Destination</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Amount</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-[var(--navy)]">{order.id}</td>
                    <td className="px-6 py-4 text-gray-700">{order.product}</td>
                    <td className="px-6 py-4 text-gray-600">{order.country}</td>
                    <td className="px-6 py-4 text-[var(--navy)]">${order.amount}</td>
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
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change, color }: {
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
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-3xl text-[var(--navy)] mb-1">{value}</div>
      <div className="text-sm text-gray-500">{change}</div>
    </div>
  );
}
