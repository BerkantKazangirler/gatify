import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  Package,
  FileText,
  Image,
  CheckCircle,
} from "lucide-react";

const issueTypes = [
  {
    value: "customs_stuck",
    label: "Package Stuck in Customs",
    icon: <AlertCircle className="w-5 h-5" />,
  },
  {
    value: "incorrect_tax",
    label: "Incorrect Tax Calculation",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    value: "damaged_product",
    label: "Damaged or Defective Product",
    icon: <Package className="w-5 h-5" />,
  },
  {
    value: "shipping_delay",
    label: "Shipping Delay",
    icon: <AlertCircle className="w-5 h-5" />,
  },
  {
    value: "refund_request",
    label: "Refund Request",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    value: "other",
    label: "Other Issue",
    icon: <FileText className="w-5 h-5" />,
  },
];

export function SupportTicket() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    issueType: "customs_stuck",
    subject: "",
    description: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate("/help");
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl text-[var(--navy)] mb-4">
            Talep Gönderildi!
          </h1>
          <p className="text-gray-600 mb-2">
            Destek talebin başarıyla oluşturuldu. Ekibimiz talebini inceleyip
            2-4 saat içinde yanıt verecek.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            E-posta güncellemelerini şu adresten alacaksın{" "}
            <span className="text-[var(--navy)]">{formData.email}</span>
          </p>
          <div className="inline-flex gap-2 mb-4">
            <div className="w-2 h-2 bg-[var(--electric-blue)] rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-[var(--electric-blue)] rounded-full animate-pulse delay-100" />
            <div className="w-2 h-2 bg-[var(--electric-blue)] rounded-full animate-pulse delay-200" />
          </div>
          <p className="text-sm text-gray-500">
            Yardım Merkezine yönlendiriliyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/help"
            className="flex items-center gap-2 text-[var(--electric-blue)] hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Yardım Merkezine Dön
          </Link>
          <h1 className="text-3xl text-[var(--navy)] mb-2">
            Destek Talebi Gönder
          </h1>
          <p className="text-gray-600">
            Siparişinle ilgili sorun mu yaşıyorsun? Uzman ekibimiz sorunu
            çözmene yardımcı olmak için burada.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl text-[var(--navy)] mb-6">
                  İletişim Bilgileri
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm text-gray-700">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-700">
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm text-gray-700">
                      Sipariş No <span className="text-gray-500">(varsa)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.orderId}
                      onChange={(e) => updateField("orderId", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                      placeholder="ORD-2451"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl text-[var(--navy)] mb-6">
                  Sorun Detayları
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block mb-3 text-sm text-gray-700">
                      Sorun Türü
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {issueTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => updateField("issueType", type.value)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                            formData.issueType === type.value
                              ? "border-[var(--electric-blue)] bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`${
                              formData.issueType === type.value
                                ? "text-[var(--electric-blue)]"
                                : "text-gray-400"
                            }`}
                          >
                            {type.icon}
                          </div>
                          <span className="text-sm text-[var(--navy)]">
                            {type.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-700">
                      Konu
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => updateField("subject", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                      placeholder="Sorunun kısa özeti"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-700">
                      Açıklama
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] resize-none"
                      rows={6}
                      placeholder="Lütfen sorun hakkında mümkün olduğunca detay ver. Takip numaralarını, hata mesajlarını veya ilgili diğer bilgileri ekle."
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl text-[var(--navy)] mb-3">Ekler</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Takılan gümrük durumu ekran görüntülerini, hata mesajlarını
                  veya hasarlı ürün fotoğraflarını yükle (En fazla 5 dosya, her
                  biri 10MB)
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-[var(--electric-blue)] transition-colors cursor-pointer bg-gray-50"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Dosya Yükle</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                  <p className="flex items-start gap-2">
                    <Image className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Gümrük sorunları için takip durumunu ve gümrük
                      yetkililerinden gelen bildirimleri gösteren ekran
                      görüntülerini ekle.
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--electric-blue)] text-white py-4 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-lg"
              >
                Destek Talebi Gönder
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg text-[var(--navy)] mb-4">
                Seni Neler Bekliyor
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    1
                  </div>
                  <div>
                    <div className="text-sm text-[var(--navy)] mb-1">
                      Anında Onay
                    </div>
                    <div className="text-xs text-gray-600">
                      Talep numaranla birlikte e-posta alacaksın
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    2
                  </div>
                  <div>
                    <div className="text-sm text-[var(--navy)] mb-1">
                      Ekip İncelemesi
                    </div>
                    <div className="text-xs text-gray-600">
                      Uzmanlarımız talebini 2-4 saat içinde inceler
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    3
                  </div>
                  <div>
                    <div className="text-sm text-[var(--navy)] mb-1">Çözüm</div>
                    <div className="text-xs text-gray-600">
                      Sana çözüm veya sonraki adımları sunacağız
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--navy)] to-[var(--electric-blue)] rounded-xl p-6 text-white">
              <AlertCircle className="w-8 h-8 mb-4" />
              <h3 className="text-lg mb-2">Öncelikli Destek</h3>
              <p className="text-sm text-gray-300 mb-4">
                Gümrükle ilgili sorunlar önceliklidir ve genellikle 24 saat
                içinde çözülür.
              </p>
              <div className="space-y-2 text-sm">
                <div>📧 E-posta: support@gatify.com</div>
                <div>⏰ Saatler: 7/24 Destek</div>
                <div>📞 Ortalama Yanıt: 2.4 saat</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg text-[var(--navy)] mb-3">
                Hızlı İpuçları
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Daha hızlı işlem için sipariş numaranı ekle</li>
                <li>✓ Net fotoğraf/ekran görüntüleri ekle</li>
                <li>✓ Hata mesajlarını açıkça yaz</li>
                <li>✓ Sorunun ne zaman başladığını belirt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
