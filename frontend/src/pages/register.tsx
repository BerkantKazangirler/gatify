import { Link, useNavigate } from "react-router";
import { Package, Mail, Lock, User, CreditCard, ArrowRight, Shield } from "lucide-react";
import { useState } from "react";
import { registerUserApi } from "../utils/authApi";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    citizenId: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerUserApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        citizenId: formData.citizenId,
      });

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Kayıt olurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--navy)] via-[var(--navy-light)] to-[var(--navy-dark)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-12 h-12 text-[var(--electric-blue)]" />
            <h1 className="text-4xl text-white">Gatify</h1>
          </div>
          <p className="text-gray-300">Küresel ticaret yolculuğuna başla</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl mb-2 text-[var(--navy)]">Hesap Oluştur</h2>
          <p className="text-gray-600 mb-6">
            Binlerce sınır ötesi alışveriş yapan kullanıcıya katıl
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}
            <div>
              <label className="block mb-2 text-sm text-gray-700">
                Ad Soyad
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] focus:border-transparent transition-all"
                  placeholder="Ahmet Yılmaz"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] focus:border-transparent transition-all"
                  placeholder="ornek@eposta.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] focus:border-transparent transition-all"
                  placeholder="Güçlü bir şifre oluştur"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                Kimlik No / Vergi No
                <Shield className="w-4 h-4 text-[var(--electric-blue)]" />
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.citizenId}
                  onChange={(e) => updateField("citizenId", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] focus:border-transparent transition-all"
                  placeholder="Gümrük ön doğrulaması için"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Otomatik gümrük beyanları ve daha hızlı işlem için gereklidir
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
              <p className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Kimlik bilginiz şifrelenir ve yalnızca gümrük doğrulaması için
                  kullanılır. Bu, işlemleri %60 hızlandırır.
                </span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--electric-blue)] text-white py-3 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Zaten hesabın var mı?{" "}
            <Link
              to="/login"
              className="text-[var(--electric-blue)] hover:underline"
            >
              Giriş Yap
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Banka düzeyinde şifreleme • GDPR uyumlu • 7/24 destek
        </p>
      </div>
    </div>
  );
}
