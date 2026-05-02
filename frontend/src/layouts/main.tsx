import { Outlet, useLocation, Link } from "react-router";
import { Package, LayoutDashboard, Search, MapPin, Settings, Store, FileText, HelpCircle, User } from "lucide-react";
import { useState } from "react";

export function RootLayout() {
  const location = useLocation();
  const [isLoggedIn] = useState(true);
  const [userRole] = useState<"buyer" | "seller" | "admin">("buyer");

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isGuestPage = location.pathname === "/" || location.pathname === "/help" || location.pathname === "/support";
  const isAdminPage = location.pathname.startsWith("/admin");
  const isSellerPage = location.pathname.startsWith("/seller");

  const showSidebar = !isAuthPage && !isGuestPage && isLoggedIn;

  if (isAuthPage) {
    return <Outlet />;
  }

  if (isGuestPage) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <Package className="w-8 h-8 text-[var(--electric-blue)]" />
              <span className="text-2xl text-[var(--navy)]">Gatify</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/products" className="text-gray-600 hover:text-[var(--navy)] transition-colors">
                Products
              </Link>
              <Link to="/help" className="text-gray-600 hover:text-[var(--navy)] transition-colors">
                Help Center
              </Link>
              <Link to="/support" className="text-gray-600 hover:text-[var(--navy)] transition-colors">
                Support
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-[var(--navy)] hover:bg-gray-100 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        <main>
          <Outlet />
        </main>

        <footer className="bg-[var(--navy)] text-white mt-20">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-6 h-6 text-[var(--electric-blue)]" />
                  <span className="text-xl">Gatify</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Global commerce made simple with automated customs and price arbitrage.
                </p>
              </div>

              <div>
                <h3 className="mb-4">Platform</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <Link to="/products" className="block hover:text-white transition-colors">Browse Products</Link>
                  <Link to="/help" className="block hover:text-white transition-colors">How It Works</Link>
                  <Link to="/register" className="block hover:text-white transition-colors">Become a Seller</Link>
                </div>
              </div>

              <div>
                <h3 className="mb-4">Support</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <Link to="/help" className="block hover:text-white transition-colors">FAQ</Link>
                  <Link to="/support" className="block hover:text-white transition-colors">Contact Us</Link>
                  <a href="#" className="block hover:text-white transition-colors">Customs Guide</a>
                </div>
              </div>

              <div>
                <h3 className="mb-4">Legal</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <a href="#" className="block hover:text-white transition-colors">Terms of Service</a>
                  <a href="#" className="block hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="block hover:text-white transition-colors">Cookie Policy</a>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--navy-light)] mt-8 pt-8 text-center text-sm text-gray-400">
              © 2026 Gatify. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {showSidebar && (
        <aside className="w-64 bg-[var(--navy)] text-white flex flex-col">
          <div className="p-6 border-b border-[var(--navy-light)]">
            <Link to="/" className="flex items-center gap-3">
              <Package className="w-8 h-8 text-[var(--electric-blue)]" />
              <h1 className="text-2xl">Gatify</h1>
            </Link>
            <p className="text-sm text-gray-400 mt-1">
              {isSellerPage ? "Seller Portal" : isAdminPage ? "Admin Panel" : "Global Trade Platform"}
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {isAdminPage ? (
              <>
                <NavLink to="/admin" icon={<Settings className="w-5 h-5" />} label="Admin Panel" active={location.pathname === "/admin"} />
                <NavLink to="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Back to Dashboard" active={false} />
              </>
            ) : isSellerPage ? (
              <>
                <NavLink to="/seller" icon={<Store className="w-5 h-5" />} label="Seller Dashboard" active={location.pathname === "/seller"} />
                <NavLink to="/seller/products/new" icon={<Package className="w-5 h-5" />} label="Add Product" active={location.pathname.includes("/products/")} />
                <NavLink to="/seller/export-docs" icon={<FileText className="w-5 h-5" />} label="Export Docs" active={location.pathname === "/seller/export-docs"} />
                <div className="my-4 border-t border-[var(--navy-light)]" />
                <NavLink to="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Buyer Dashboard" active={false} />
              </>
            ) : (
              <>
                <NavLink to="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active={location.pathname === "/dashboard"} />
                <NavLink to="/products" icon={<Search className="w-5 h-5" />} label="Discover Products" active={location.pathname.startsWith("/products")} />
                <NavLink to="/tracking" icon={<MapPin className="w-5 h-5" />} label="Track Shipments" active={location.pathname === "/tracking"} />
                {userRole === "seller" && (
                  <>
                    <div className="my-4 border-t border-[var(--navy-light)]" />
                    <NavLink to="/seller" icon={<Store className="w-5 h-5" />} label="Seller Portal" active={false} />
                  </>
                )}
                {userRole === "admin" && (
                  <NavLink to="/admin" icon={<Settings className="w-5 h-5" />} label="Admin Panel" active={false} />
                )}
                <div className="my-4 border-t border-[var(--navy-light)]" />
                <NavLink to="/help" icon={<HelpCircle className="w-5 h-5" />} label="Help Center" active={location.pathname === "/help"} />
                <NavLink to="/support" icon={<FileText className="w-5 h-5" />} label="Support" active={location.pathname === "/support"} />
              </>
            )}
          </nav>

          <div className="p-4 border-t border-[var(--navy-light)]">
            <Link to="/profile" className="flex items-center gap-3 hover:bg-[var(--navy-light)] rounded-xl p-2 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[var(--electric-blue)] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm">User Account</p>
                <p className="text-xs text-gray-400 capitalize">{userRole} Role</p>
              </div>
            </Link>
          </div>
        </aside>
      )}

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

function NavLink({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        active
          ? "bg-[var(--electric-blue)] text-white"
          : "text-gray-300 hover:bg-[var(--navy-light)] hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
