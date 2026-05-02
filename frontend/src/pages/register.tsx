import { Link, useNavigate } from "react-router";
import { Package, Mail, Lock, User, CreditCard, ArrowRight, Shield } from "lucide-react";
import { useState } from "react";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    citizenId: "",
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
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
          <p className="text-gray-300">Start Your Global Commerce Journey</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl mb-2 text-[var(--navy)]">Create Account</h2>
          <p className="text-gray-600 mb-6">Join thousands of cross-border shoppers</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] focus:border-transparent transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] focus:border-transparent transition-all"
                  placeholder="Create a strong password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-700 flex items-center gap-2">
                Citizen ID / Tax Number
                <Shield className="w-4 h-4 text-[var(--electric-blue)]" />
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.citizenId}
                  onChange={(e) => updateField("citizenId", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] focus:border-transparent transition-all"
                  placeholder="For customs pre-verification"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Required for automated customs declarations and faster clearance
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
              <p className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Your ID is encrypted and used only for customs verification. This speeds up clearance by 60%.</span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--electric-blue)] text-white py-3 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors flex items-center justify-center gap-2 group"
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-[var(--electric-blue)] hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Bank-grade encryption • GDPR compliant • 24/7 support
        </p>
      </div>
    </div>
  );
}
