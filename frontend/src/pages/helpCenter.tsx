import { useState } from "react";
import { Search, ChevronDown, HelpCircle, Shield, Package, CreditCard, RefreshCw, MessageSquare } from "lucide-react";
import { Link } from "react-router";

const categories = [
  {
    id: "customs",
    name: "Gümrük Kuralları",
    icon: <Shield className="w-5 h-5" />,
    count: 12,
  },
  {
    id: "shipping",
    name: "Kargo Politikaları",
    icon: <Package className="w-5 h-5" />,
    count: 8,
  },
  {
    id: "payments",
    name: "Ödeme ve Fiyatlandırma",
    icon: <CreditCard className="w-5 h-5" />,
    count: 6,
  },
  {
    id: "refunds",
    name: "İade ve Geri Dönüş",
    icon: <RefreshCw className="w-5 h-5" />,
    count: 5,
  },
];

const faqs = {
  customs: [
    {
      question: "Gatify gümrük işlemlerini nasıl yönetir?",
      answer:
        "Gatify, önceden doğrulanmış kimlik bilgini kullanarak gümrük beyanını otomatikleştirir. Gerekli tüm formları (Ticari Fatura, CN23) oluşturur ve gümrük yetkililerine elektronik olarak iletir. Sistemimiz vergileri ve harçları önceden hesaplar, böylece sürpriz olmaz. Ortalama işlem süresi 2-3 gündür.",
    },
    {
      question: "Paketim gümrükte takılırsa ne olur?",
      answer:
        "Gönderin 5 günden fazla bekletilirse Gümrük Kırmızı Alarm sistemimiz devreye girer. Bunu takip sayfanda 'Dilekçe PDF'ini Otomatik Oluştur' butonuyla görürsün. Buna basarak yetkililere sunabileceğin uygun biçimde hazırlanmış bir gümrük dilekçesi oluşturursun. Destek ekibimiz de gerekirse süreci hızlandırmaya yardımcı olur.",
    },
    {
      question: "Gümrük vergileri ve KDV fiyata dahil mi?",
      answer:
        "Hayır, gümrük vergileri ve KDV ayrı hesaplanır ve ürün sayfalarındaki vergi dağılımında gösterilir. 'Değer mi?' skoru, tüm masrafları (baz fiyat + kargo + gümrük + KDV) hesaba katar ve toplam maliyetten sonra fırsatın iyi olup olmadığını anlamana yardımcı olur.",
    },
    {
      question: "Gatify hangi ülkelerde gümrük desteği sağlar?",
      answer:
        "Şu anda 150'den fazla ülke için otomatik gümrük işlemi desteği sunuyoruz. Sistemimiz ABD, Birleşik Krallık, AB ülkeleri, Japonya, Avustralya ve Kanada gibi büyük pazarlar için güncel oran ve düzenlemelere sahiptir. Ülkeye özel tahminler için ürün detay sayfasını kontrol et.",
    },
  ],
  shipping: [
    {
      question: "Kargo seçenekleri nelerdir?",
      answer:
        "İki gönderim yöntemi sunuyoruz: Hava Kargosu (daha hızlı, 5-7 gün) ve Deniz Kargosu (daha ekonomik, 21-28 gün). Fiyatlar çıkış ülkesine ve paket ağırlığına göre değişir. Ürün detay sayfasında gümrük süresi dahil gerçek zamanlı varış tahminleriyle her iki seçeneği karşılaştırabilirsin.",
    },
    {
      question: "Teslimat tahminleri ne kadar doğru?",
      answer:
        "Teslimat tahminlerimiz, transit süresine ek olarak varış noktan için geçmiş verilere dayalı tahmini gümrük süresini de içerir. Hava kargosu genellikle 2-3 günde, deniz kargosu 3-5 günde gümrükten çıkar. Gümrük işlemleri beklenenden hızlı veya yavaş olursa varış saatlerini gerçek zamanlı güncelleriz.",
    },
    {
      question: "Gönderimi gerçek zamanlı takip edebilir miyim?",
      answer:
        "Evet! Takip sayfamız, gönderinin yolculuğunu canlı güncellemelerle etkileşimli bir harita üzerinde gösterir. Sipariş Verildi → Sevk Edildi → Yolda → Gümrükten Geçiş → Teslimata Çıktı adımlarını görürsün. Önemli durum değişiklikleri için e-posta ve anlık bildirim göndeririz.",
    },
    {
      question: "Gönderim kaybolursa veya hasar görürse ne olur?",
      answer:
        "Tüm uluslararası gönderiler beyan edilen değere kadar sigortalıdır. Paket kaybolursa veya hasarlı gelirse, Destek Talebi sistemi üzerinden başvuru oluştur (hasar talepleri için fotoğraf ekle). Doğrulamadan sonra 5-7 iş günü içinde iade veya değişim işlemini tamamlarız.",
    },
  ],
  payments: [
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, Amex), debit cards, and PayPal. Payment is processed securely at checkout. We do NOT charge your card until your order ships, so if a seller cancels, you won't be charged.",
    },
    {
      question: "Why is the global price different from local prices?",
      answer:
        "Global prices are what sellers in other countries charge for the same product. Price differences exist due to local demand, taxes, import duties already paid by local retailers, and currency exchange rates. Gatify helps you find products where the global price + shipping + customs is still cheaper than buying locally.",
    },
    {
      question: "What is the 'Worth It?' score?",
      answer:
        "The Worth It? score is calculated as: (Local Price - Total Cost) / Local Price × 100. It shows your savings percentage AFTER all fees (shipping, customs, VAT). A score of 70%+ (green) means you're getting an excellent deal. Below 70% (yellow) is still a good deal but with smaller margins.",
    },
  ],
  refunds: [
    {
      question: "What is your refund policy?",
      answer:
        "You can request a refund within 30 days of delivery if the product is defective, significantly different from the description, or doesn't arrive. Buyer's remorse (changed your mind) is handled case-by-case. Refunds are processed to your original payment method within 5-7 business days.",
    },
    {
      question: "Who pays for return shipping on refunds?",
      answer:
        "If the product is defective or not as described, we cover return shipping. If you're returning due to buyer's remorse and the seller accepts the return, you'll pay return shipping costs. Note: international return shipping can be expensive—check with our support team for the most economical method.",
    },
    {
      question: "Can I cancel an order after placing it?",
      answer:
        "Yes, but only before the seller ships it. Once the order status changes to 'Dispatched', cancellation is no longer possible. If you need to cancel, go to your order in the Tracking page and click 'Request Cancellation' immediately. Most sellers respond within 24 hours.",
    },
  ],
};

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("customs");
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-[var(--navy)] to-[var(--electric-blue)] text-white py-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-300 mb-8">
            Search our knowledge base or browse categories below
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-xl bg-white text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl"
              placeholder="Search for help articles..."
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                selectedCategory === category.id
                  ? "border-[var(--electric-blue)] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  selectedCategory === category.id
                    ? "bg-[var(--electric-blue)] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {category.icon}
              </div>
              <h3 className="text-lg text-[var(--navy)] mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count} articles</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl text-[var(--navy)] mb-6">
              {categories.find((c) => c.id === selectedCategory)?.name}
            </h2>

            <div className="space-y-4">
              {faqs[selectedCategory as keyof typeof faqs]?.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg text-[var(--navy)] pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
                        openFAQ === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openFAQ === index && (
                    <div className="px-6 py-5 border-t border-gray-200 bg-gray-50">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[var(--navy)] to-[var(--electric-blue)] rounded-xl p-6 text-white">
              <MessageSquare className="w-8 h-8 mb-4" />
              <h3 className="text-xl mb-2">Still need help?</h3>
              <p className="text-gray-300 text-sm mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <Link
                to="/support"
                className="block w-full text-center bg-white text-[var(--navy)] py-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg text-[var(--navy)] mb-4">Popular Articles</h3>
              <div className="space-y-3">
                <a href="#" className="block text-[var(--electric-blue)] hover:underline text-sm">
                  → How to calculate total import costs
                </a>
                <a href="#" className="block text-[var(--electric-blue)] hover:underline text-sm">
                  → Understanding the Worth It? score
                </a>
                <a href="#" className="block text-[var(--electric-blue)] hover:underline text-sm">
                  → What to do if customs holds my package
                </a>
                <a href="#" className="block text-[var(--electric-blue)] hover:underline text-sm">
                  → Difference between air and sea freight
                </a>
                <a href="#" className="block text-[var(--electric-blue)] hover:underline text-sm">
                  → How to become a seller on Gatify
                </a>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg text-[var(--navy)] mb-2">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Response Time</span>
                  <span className="text-[var(--navy)] font-medium">2.4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolution Rate</span>
                  <span className="text-[var(--navy)] font-medium">96%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Customs Clearance</span>
                  <span className="text-[var(--navy)] font-medium">2.8 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
