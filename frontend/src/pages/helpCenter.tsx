import { useState } from "react";
import { Search, ChevronDown, HelpCircle, Shield, Package, CreditCard, RefreshCw, MessageSquare } from "lucide-react";
import { Link } from "react-router";

const categories = [
  { id: "customs", name: "Customs Regulations", icon: <Shield className="w-5 h-5" />, count: 12 },
  { id: "shipping", name: "Shipping Policies", icon: <Package className="w-5 h-5" />, count: 8 },
  { id: "payments", name: "Payments & Pricing", icon: <CreditCard className="w-5 h-5" />, count: 6 },
  { id: "refunds", name: "Refunds & Returns", icon: <RefreshCw className="w-5 h-5" />, count: 5 },
];

const faqs = {
  customs: [
    {
      question: "How does Gatify handle customs clearance?",
      answer: "Gatify automates customs declaration using your pre-verified Citizen ID. We generate all required forms (Commercial Invoice, CN23) and submit them electronically to customs authorities. Our system calculates duties and taxes upfront, so there are no surprises. Average clearance time is 2-3 days.",
    },
    {
      question: "What if my package gets stuck in customs?",
      answer: "If your shipment is held for more than 5 days, our Customs Red Alert system activates. You'll see this on your tracking page with an 'Auto-Generate Petition PDF' button. Click it to generate a properly formatted customs petition document that you can submit to authorities. Our support team can also assist with escalations.",
    },
    {
      question: "Are customs taxes and VAT included in the price?",
      answer: "No, customs taxes and VAT are calculated separately and shown in the Tax Breakdown on product pages. The 'Worth It?' score factors in ALL costs (base price + shipping + customs + VAT) to help you decide if the deal is good after all fees.",
    },
    {
      question: "Which countries does Gatify support for customs?",
      answer: "We currently support automated customs processing for 150+ countries. Our system has up-to-date customs rates and regulations for major markets including USA, UK, EU countries, Japan, Australia, and Canada. Check the product detail page for country-specific estimates.",
    },
  ],
  shipping: [
    {
      question: "What are the shipping options?",
      answer: "We offer two shipping methods: Air Freight (faster, 5-7 days) and Sea Freight (economical, 21-28 days). Prices vary by origin country and package weight. You can compare both options on the product detail page with real-time ETA predictions including customs clearance time.",
    },
    {
      question: "How accurate are the delivery estimates?",
      answer: "Our delivery estimates include transit time PLUS predicted customs clearance duration based on historical data for your destination. Air freight typically clears in 2-3 days, sea freight in 3-5 days. We update ETAs in real-time if customs processing is faster or slower than expected.",
    },
    {
      question: "Can I track my shipment in real-time?",
      answer: "Yes! Our Tracking page shows your shipment's journey on an interactive map with live updates. You'll see each milestone: Order Placed → Dispatched → In Transit → Customs Clearance → Out for Delivery. We send email and push notifications for major status changes.",
    },
    {
      question: "What happens if my shipment is lost or damaged?",
      answer: "All international shipments are insured up to the declared value. If your package is lost or arrives damaged, file a claim through our Support Ticket system (attach photos for damage claims). We'll process refunds or replacements within 5-7 business days after verification.",
    },
  ],
  payments: [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, Amex), debit cards, and PayPal. Payment is processed securely at checkout. We do NOT charge your card until your order ships, so if a seller cancels, you won't be charged.",
    },
    {
      question: "Why is the global price different from local prices?",
      answer: "Global prices are what sellers in other countries charge for the same product. Price differences exist due to local demand, taxes, import duties already paid by local retailers, and currency exchange rates. Gatify helps you find products where the global price + shipping + customs is still cheaper than buying locally.",
    },
    {
      question: "What is the 'Worth It?' score?",
      answer: "The Worth It? score is calculated as: (Local Price - Total Cost) / Local Price × 100. It shows your savings percentage AFTER all fees (shipping, customs, VAT). A score of 70%+ (green) means you're getting an excellent deal. Below 70% (yellow) is still a good deal but with smaller margins.",
    },
  ],
  refunds: [
    {
      question: "What is your refund policy?",
      answer: "You can request a refund within 30 days of delivery if the product is defective, significantly different from the description, or doesn't arrive. Buyer's remorse (changed your mind) is handled case-by-case. Refunds are processed to your original payment method within 5-7 business days.",
    },
    {
      question: "Who pays for return shipping on refunds?",
      answer: "If the product is defective or not as described, we cover return shipping. If you're returning due to buyer's remorse and the seller accepts the return, you'll pay return shipping costs. Note: international return shipping can be expensive—check with our support team for the most economical method.",
    },
    {
      question: "Can I cancel an order after placing it?",
      answer: "Yes, but only before the seller ships it. Once the order status changes to 'Dispatched', cancellation is no longer possible. If you need to cancel, go to your order in the Tracking page and click 'Request Cancellation' immediately. Most sellers respond within 24 hours.",
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
