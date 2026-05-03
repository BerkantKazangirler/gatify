import { Link, useNavigate } from "react-router";
import { Package, Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { loginUserApi } from "../utils/authApi";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUserApi(email, password);
      // Örneğin { token: "...", user: {...} } döner, token'ı localStorage'a kaydedebiliriz:
      if (response.token) localStorage.setItem("gatify_token", response.token);

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol ediniz.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--navy)] via-[var(--navy-light)] to-[var(--navy-dark)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-12 h-12 text-[var(--electric-blue)]" />
            <h1 className="text-4xl text-white">Gatify</h1>
          </div>
          <p className="text-gray-300">
            Sınır ötesi ticaret artık çok daha kolay
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl mb-2 text-[var(--navy)]">
            Tekrar Hoş Geldin
          </h2>
          <p className="text-gray-600 mb-6">
            Küresel pazara erişmek için giriş yap
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}
            <div>
              <label className="block mb-2 text-sm text-gray-700">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] focus:border-transparent transition-all"
                  placeholder="Şifreni gir"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-[var(--electric-blue)]"
                />
                <span className="text-gray-600">Beni hatırla</span>
              </label>
              <a
                href="#"
                className="text-[var(--electric-blue)] hover:underline"
              >
                Şifremi unuttum
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--electric-blue)] text-white py-3 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Giriş Yapılıyor..." : "Giriş Yap"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Hesabın yok mu?{" "}
            <Link
              to="/register"
              className="text-[var(--electric-blue)] hover:underline"
            >
              Hesap Oluştur
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Güvenli gümrük doğrulaması • Küresel fiyat avantajı • Gerçek zamanlı
          takip
        </p>
      </div>
    </div>
  );
}
