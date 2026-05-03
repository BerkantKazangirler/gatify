import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  User,
  Mail,
  CreditCard,
  Shield,
  Bell,
  Globe,
  ChevronRight,
  Store,
  LayoutDashboard,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"buyer" | "seller">(
    (user?.role as "buyer" | "seller") || "buyer",
  );
  console.log(setUserRole); // Keep for linter

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    customsAlerts: true,
    priceDrops: false,
    newsletter: true,
  });

  const [activeModal, setActiveModal] = useState<
    "password" | "twoFactor" | "logout" | null
  >(null);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl text-[var(--navy)] mb-2">
            Profil ve Ayarlar
          </h1>
          <p className="text-gray-600">
            Hesabını, tercihlerini ve kullanıcı rollerini yönet
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl text-[var(--navy)]">Hesap Bilgileri</h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm text-gray-700">
                      Ad Soyad
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)]">
                      <User className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        defaultValue={user?.name || ""}
                        className="flex-1 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-700">
                      E-posta Adresi
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)]">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        defaultValue={user?.email || ""}
                        className="flex-1 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Kimlik No / Vergi No
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)]">
                      <Shield className="w-5 h-5 text-green-600" />
                      <input
                        type="text"
                        defaultValue={user?.citizenId || "Belirtilmemiş"}
                        className="flex-1 bg-transparent focus:outline-none"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-700">
                      Ülke
                    </label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-white">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <select className="flex-1 bg-transparent focus:outline-none">
                        <option>Amerika Birleşik Devletleri</option>
                        <option>Birleşik Krallık</option>
                        <option>Almanya</option>
                        <option>Japonya</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button className="px-6 py-3 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors">
                  Değişiklikleri Kaydet
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl text-[var(--navy)]">
                    Kullanıcı Rolü ve Panel Erişimi
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Alıcı ve satıcı modları arasında geçiş yap
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-xl text-sm capitalize ${
                    userRole === "buyer"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {userRole} modu
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
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          userRole === "buyer"
                            ? "bg-[var(--electric-blue)] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <LayoutDashboard className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg text-[var(--navy)]">
                          Alıcı Paneli
                        </h3>
                        {userRole === "buyer" && (
                          <span className="text-xs text-[var(--electric-blue)]">
                            Şu anda aktif
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Ürünlere göz at, gönderileri takip et ve satın alımlarını
                      yönet
                    </p>
                    <div className="flex items-center text-[var(--electric-blue)] text-sm">
                      <span>Alıcı Paneline Git</span>
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
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          userRole === "seller"
                            ? "bg-[var(--electric-blue)] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Store className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg text-[var(--navy)]">
                          Satıcı Paneli
                        </h3>
                        {userRole === "seller" && (
                          <span className="text-xs text-[var(--electric-blue)]">
                            Şu anda aktif
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Envanteri yönet, siparişleri işle ve dışa aktarım
                      belgeleri oluştur
                    </p>
                    <div className="flex items-center text-[var(--electric-blue)] text-sm">
                      <span>Satıcı Paneline Git</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                  <p className="flex items-start gap-2">
                    <Store className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Yan menüden istediğin zaman paneller arasında geçiş
                      yapabilirsin. İki rol aynı hesabı paylaşır ancak farklı
                      özellik ve izinlere sahiptir.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl text-[var(--navy)] flex items-center gap-2">
                  <Bell className="w-6 h-6 text-[var(--electric-blue)]" />
                  Bildirim Tercihleri
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <NotificationToggle
                  label="Sipariş Güncellemeleri"
                  description="Kargo durumu, teslimat onayları"
                  enabled={notifications.orderUpdates}
                  onChange={() => toggleNotification("orderUpdates")}
                />
                <NotificationToggle
                  label="Gümrük Uyarıları"
                  description="Paketler takıldığında kırmızı alarm"
                  enabled={notifications.customsAlerts}
                  onChange={() => toggleNotification("customsAlerts")}
                />
                <NotificationToggle
                  label="Fiyat Düşüşü Uyarıları"
                  description="Kaydedilen ürünlerin fiyatı düşünce bildir"
                  enabled={notifications.priceDrops}
                  onChange={() => toggleNotification("priceDrops")}
                />
                <NotificationToggle
                  label="Bülten ve Kampanyalar"
                  description="Haftalık fırsatlar ve platform güncellemeleri"
                  enabled={notifications.newsletter}
                  onChange={() => toggleNotification("newsletter")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg text-[var(--navy)] mb-4">
                Hızlı İşlemler
              </h3>
              <div className="space-y-2">
                <Link
                  to="/tracking"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="text-sm text-gray-700">
                    Gönderileri Takip Et
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  to="/help"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="text-sm text-gray-700">Yardım Merkezi</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  to="/support"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="text-sm text-gray-700">
                    Destekle İletişime Geç
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg text-[var(--navy)] mb-4">
                Hesap İstatistikleri
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Toplam Sipariş</span>
                  <span className="text-[var(--navy)] font-medium">47</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Toplam Tasarruf</span>
                  <span className="text-green-600 font-medium">$1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Üyelik Tarihi</span>
                  <span className="text-[var(--navy)] font-medium">
                    Jan 2026
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Doğrulama Durumu</span>
                  <span className="text-green-600 font-medium">Verified</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg text-[var(--navy)] mb-4">Güvenlik</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveModal("password")}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    Şifreyi Değiştir
                  </span>
                </button>
                <button
                  onClick={() => setActiveModal("twoFactor")}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    İki Aşamalı Doğrulama
                  </span>
                </button>
                <button
                  onClick={() => setActiveModal("logout")}
                  className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors text-left text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Çıkış Yap</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === "password" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-medium mb-4">Şifreyi Değiştir</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Mevcut Şifre
                </label>
                <input
                  type="password"
                  placeholder="Mevcut şifreniz"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  placeholder="Yeni şifreniz"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-700">
                  Yeni Şifre (Tekrar)
                </label>
                <input
                  type="password"
                  placeholder="Yeni şifrenizi tekrar girin"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none"
                />
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-3 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors mt-2"
              >
                Şifreyi Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "twoFactor" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-medium mb-4">İki Aşamalı Doğrulama</h3>
            <p className="text-gray-600 mb-6">
              Hesabınızı korumak için 2FA özelliğini aktif edin.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                Aktifleştir
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-3 border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "logout" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm relative text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              Çıkış Yapmak Üzeresiniz
            </h3>
            <p className="text-gray-600 mb-6">
              Devam etmek istediğinize emin misiniz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
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
