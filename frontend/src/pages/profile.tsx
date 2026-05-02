import { useState } from "react";
import { Link } from "react-router";
import { User, Mail, CreditCard, Shield, Bell, Globe, ChevronRight, Store, LayoutDashboard, Settings, LogOut } from "lucide-react";

export function Profile() {
  const [userRole, setUserRole] = useState<"buyer" | "seller">("buyer");
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    customsAlerts: true,
    priceDrops: false,
    newsletter: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl text-[var(--navy)] mb-2">Profile & Settings</h1>
          <p className="text-gray-600">Manage your account, preferences, and user roles</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl text-[var(--navy)]">Account Information</h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm text-gray-700">Full Name</label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)]">
                      <User className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="flex-1 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-700">Email Address</label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)]">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="flex-1 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Citizen ID / Tax Number
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)]">
                      <Shield className="w-5 h-5 text-green-600" />
                      <input
                        type="text"
                        defaultValue="••••••••1234"
                        className="flex-1 bg-transparent focus:outline-none"
                        disabled
                      />
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Verified</span>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-700">Country</label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-white">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <select className="flex-1 bg-transparent focus:outline-none">
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Germany</option>
                        <option>Japan</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button className="px-6 py-3 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl text-[var(--navy)]">User Role & Dashboard Access</h2>
                  <p className="text-sm text-gray-600 mt-1">Switch between buyer and seller modes</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm capitalize ${
                  userRole === "buyer"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}>
                  {userRole} Mode
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Link
                    to="/dashboard"
                    className={`p-6 rounded-xl border-2 transition-all ${
                      userRole === "buyer"
                        ? "border-[var(--electric-blue)] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        userRole === "buyer"
                          ? "bg-[var(--electric-blue)] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        <LayoutDashboard className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg text-[var(--navy)]">Buyer Dashboard</h3>
                        {userRole === "buyer" && (
                          <span className="text-xs text-[var(--electric-blue)]">Currently Active</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Browse products, track shipments, and manage your purchases
                    </p>
                    <div className="flex items-center text-[var(--electric-blue)] text-sm">
                      <span>Go to Buyer Dashboard</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>

                  <Link
                    to="/seller"
                    className={`p-6 rounded-xl border-2 transition-all ${
                      userRole === "seller"
                        ? "border-[var(--electric-blue)] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        userRole === "seller"
                          ? "bg-[var(--electric-blue)] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        <Store className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg text-[var(--navy)]">Seller Dashboard</h3>
                        {userRole === "seller" && (
                          <span className="text-xs text-[var(--electric-blue)]">Currently Active</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Manage inventory, process orders, and generate export docs
                    </p>
                    <div className="flex items-center text-[var(--electric-blue)] text-sm">
                      <span>Go to Seller Dashboard</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                  <p className="flex items-start gap-2">
                    <Store className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      You can switch between dashboards anytime from the sidebar navigation.
                      Both roles share the same account but have different features and permissions.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl text-[var(--navy)] flex items-center gap-2">
                  <Bell className="w-6 h-6 text-[var(--electric-blue)]" />
                  Notification Preferences
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <NotificationToggle
                  label="Order Updates"
                  description="Shipping status, delivery confirmations"
                  enabled={notifications.orderUpdates}
                  onChange={() => toggleNotification("orderUpdates")}
                />
                <NotificationToggle
                  label="Customs Alerts"
                  description="Red alerts when packages are stuck"
                  enabled={notifications.customsAlerts}
                  onChange={() => toggleNotification("customsAlerts")}
                />
                <NotificationToggle
                  label="Price Drop Alerts"
                  description="Notify when saved products drop in price"
                  enabled={notifications.priceDrops}
                  onChange={() => toggleNotification("priceDrops")}
                />
                <NotificationToggle
                  label="Newsletter & Promotions"
                  description="Weekly deals and platform updates"
                  enabled={notifications.newsletter}
                  onChange={() => toggleNotification("newsletter")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg text-[var(--navy)] mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/tracking"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="text-sm text-gray-700">Track Shipments</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  to="/help"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="text-sm text-gray-700">Help Center</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  to="/support"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="text-sm text-gray-700">Contact Support</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg text-[var(--navy)] mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="text-[var(--navy)] font-medium">47</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Saved</span>
                  <span className="text-green-600 font-medium">$1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="text-[var(--navy)] font-medium">Jan 2026</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Verification Status</span>
                  <span className="text-green-600 font-medium">Verified</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg text-[var(--navy)] mb-4">Security</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Change Password</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Two-Factor Auth</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors text-left text-red-600">
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationToggle({ label, description, enabled, onChange }: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
      <div className="flex-1">
        <div className="text-[var(--navy)] mb-1">{label}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? "bg-[var(--electric-blue)]" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            enabled ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}
