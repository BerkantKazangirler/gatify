import { Outlet, useLocation, Link, useNavigate } from "react-router";
import {
  Package,
  LayoutDashboard,
  Search,
  MapPin,
  Settings,
  Store,
  FileText,
  HelpCircle,
  User,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import classNames from "classnames";
import { useAuth } from "../context/AuthContext";

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userRole] = useState<"buyer" | "seller" | "admin">("buyer");
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setIsScrolled(currentScrollY > 0);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClick = () => setShowUserMenu(false);
    if (showUserMenu) document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isGuestPage =
    location.pathname === "/" ||
    location.pathname === "/products" ||
    location.pathname.startsWith("/products/") ||
    location.pathname === "/help" ||
    location.pathname === "/support";
  const shouldAutoHideGuestHeader =
    location.pathname === "/" ||
    location.pathname === "/help" ||
    location.pathname === "/support";
  const isAdminPage = location.pathname.startsWith("/admin");
  const isSellerPage = location.pathname.startsWith("/seller");

  const showSidebar = !isAuthPage && !isGuestPage && !!user;

  if (isAuthPage) {
    return <Outlet />;
  }

  // User initials for avatar
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  if (isGuestPage) {
    return (
      <div className="min-h-screen bg-white">
        <header
          className={`sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 ${
            shouldAutoHideGuestHeader && !showHeader
              ? "-translate-y-full"
              : "translate-y-0"
          }`}
        >
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <Package
                className={classNames("w-8 transition-all duration-300 h-8", {
                  "text-[var(--electric-blue)]": !isScrolled,
                  "text-gray-400": isScrolled,
                })}
              />
              <span className="text-2xl font-space-grotesk text-[var(--navy)]">
                Gatify
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/products"
                className="text-gray-600 hover:text-[var(--navy)] transition-colors"
              >
                Ürünler
              </Link>
              <Link
                to="/help"
                className="text-gray-600 hover:text-[var(--navy)] transition-colors"
              >
                Yardım Merkezi
              </Link>
              <Link
                to="/support"
                className="text-gray-600 hover:text-[var(--navy)] transition-colors"
              >
                Destek
              </Link>
            </nav>

            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[var(--electric-blue)] flex items-center justify-center text-white text-sm font-medium">
                    {userInitials}
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {user.name}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Panel
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      Profil
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-[var(--navy)] hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors"
                >
                  Başla
                </Link>
              </div>
            )}
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
                  <span className="text-xl font-space-grotesk">Gatify</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Otomatik gümrük ve fiyat avantajı ile küresel ticareti
                  basitleştirir.
                </p>
              </div>

              <div>
                <h3 className="mb-4 font-space-grotesk">Platform</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <Link
                    to="/products"
                    className="block hover:text-white transition-colors"
                  >
                    Ürünleri İncele
                  </Link>
                  <Link
                    to="/help"
                    className="block hover:text-white transition-colors"
                  >
                    Nasıl Çalışır
                  </Link>
                  <Link
                    to="/register"
                    className="block hover:text-white transition-colors"
                  >
                    Satıcı Ol
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-space-grotesk">Destek</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <Link
                    to="/help"
                    className="block hover:text-white transition-colors"
                  >
                    SSS
                  </Link>
                  <Link
                    to="/support"
                    className="block hover:text-white transition-colors"
                  >
                    Bize Ulaşın
                  </Link>
                  <a
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Gümrük Rehberi
                  </a>
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-space-grotesk">Yasal</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <a
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Hizmet Şartları
                  </a>
                  <a
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Gizlilik Politikası
                  </a>
                  <a
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Çerez Politikası
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--navy-light)] mt-8 pt-8 text-center text-sm text-gray-400">
              © 2026 Gatify. Tüm hakları saklıdır.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // App layout with sidebar (authenticated pages)
  return (
    <div className="flex h-screen bg-background">
      {showSidebar && (
        <aside className="w-64 bg-[var(--navy)] text-white flex flex-col">
          <div className="p-6 border-b border-[var(--navy-light)]">
            <Link to="/" className="flex items-center gap-3">
              <Package className="w-8 h-8 text-[var(--electric-blue)]" />
              <h1 className="text-2xl font-space-grotesk">Gatify</h1>
            </Link>
            <p className="text-sm text-gray-400 mt-1">
              {isSellerPage
                ? "Satıcı Paneli"
                : isAdminPage
                  ? "Yönetici Paneli"
                  : "Küresel Ticaret Platformu"}
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {isAdminPage ? (
              <>
                <NavLink
                  to="/admin"
                  icon={<Settings className="w-5 h-5" />}
                  label="Yönetici Paneli"
                  active={location.pathname === "/admin"}
                />
                <NavLink
                  to="/dashboard"
                  icon={<LayoutDashboard className="w-5 h-5" />}
                  label="Panele Dön"
                  active={false}
                />
              </>
            ) : isSellerPage ? (
              <>
                <NavLink
                  to="/seller"
                  icon={<Store className="w-5 h-5" />}
                  label="Satıcı Paneli"
                  active={location.pathname === "/seller"}
                />
                <NavLink
                  to="/seller/products/new"
                  icon={<Package className="w-5 h-5" />}
                  label="Ürün Ekle"
                  active={location.pathname.includes("/products/")}
                />
                <NavLink
                  to="/seller/export-docs"
                  icon={<FileText className="w-5 h-5" />}
                  label="Dışa Aktarım Belgeleri"
                  active={location.pathname === "/seller/export-docs"}
                />
                <div className="my-4 border-t border-[var(--navy-light)]" />
                <NavLink
                  to="/dashboard"
                  icon={<LayoutDashboard className="w-5 h-5" />}
                  label="Alıcı Paneli"
                  active={false}
                />
              </>
            ) : (
              <>
                <NavLink
                  to="/dashboard"
                  icon={<LayoutDashboard className="w-5 h-5" />}
                  label="Panel"
                  active={location.pathname === "/dashboard"}
                />
                <NavLink
                  to="/products"
                  icon={<Search className="w-5 h-5" />}
                  label="Ürünleri Keşfet"
                  active={location.pathname.startsWith("/products")}
                />
                <NavLink
                  to="/tracking"
                  icon={<MapPin className="w-5 h-5" />}
                  label="Gönderileri Takip Et"
                  active={location.pathname === "/tracking"}
                />
                {userRole === "seller" && (
                  <>
                    <div className="my-4 border-t border-[var(--navy-light)]" />
                    <NavLink
                      to="/seller"
                      icon={<Store className="w-5 h-5" />}
                      label="Satıcı Paneli"
                      active={false}
                    />
                  </>
                )}
                {userRole === "admin" && (
                  <NavLink
                    to="/admin"
                    icon={<Settings className="w-5 h-5" />}
                    label="Admin Panel"
                    active={false}
                  />
                )}
                <div className="my-4 border-t border-[var(--navy-light)]" />
                <NavLink
                  to="/help"
                  icon={<HelpCircle className="w-5 h-5" />}
                  label="Yardım Merkezi"
                  active={location.pathname === "/help"}
                />
                <NavLink
                  to="/support"
                  icon={<FileText className="w-5 h-5" />}
                  label="Destek"
                  active={location.pathname === "/support"}
                />
              </>
            )}
          </nav>

          {/* Sidebar user section */}
          <div className="p-4 border-t border-[var(--navy-light)]">
            <Link
              to="/profile"
              className="flex items-center gap-3 hover:bg-[var(--navy-light)] rounded-xl p-2 transition-colors mb-2"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--electric-blue)] flex items-center justify-center text-white text-sm font-medium">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{user?.name || "Kullanıcı"}</p>
                <p className="text-xs text-gray-400 capitalize">
                  {user?.role || userRole}
                </p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </aside>
      )}

      <main className="flex-1 overflow-auto">
        {/* If not logged in and trying to access protected page, show login prompt */}
        {!user && !isGuestPage && !isAuthPage ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Package className="w-16 h-16 text-[var(--electric-blue)] mx-auto mb-4" />
              <h2 className="text-2xl text-[var(--navy)] mb-2">
                Giriş Yapmanız Gerekiyor
              </h2>
              <p className="text-gray-600 mb-6">
                Bu sayfayı görüntülemek için lütfen giriş yapın.
              </p>
              <Link
                to="/login"
                className="px-6 py-3 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}

function NavLink({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
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
