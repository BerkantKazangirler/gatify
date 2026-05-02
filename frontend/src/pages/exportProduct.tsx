import { useState } from "react";
import { Link } from "react-router";
import {
  FileText,
  Download,
  CheckCircle,
  Globe,
  Package,
  FileCheck,
  ArrowLeft,
} from "lucide-react";

const pendingOrders = [
  {
    id: "ORD-2451",
    product: "Premium Wireless Headphones",
    destination: "USA",
    buyer: "John Smith",
    amount: 299,
    date: "May 2",
  },
  {
    id: "ORD-2450",
    product: "Smart Home Assistant",
    destination: "Germany",
    buyer: "Hans Mueller",
    amount: 149,
    date: "May 2",
  },
  {
    id: "ORD-2449",
    product: "Portable Power Bank",
    destination: "Japan",
    buyer: "Yuki Tanaka",
    amount: 45,
    date: "May 1",
  },
];

const documentTemplates = [
  {
    name: "Commercial Invoice",
    description: "Required for all international shipments",
    icon: <FileText className="w-6 h-6" />,
    color: "blue",
  },
  {
    name: "Packing List",
    description: "Detailed itemization for customs",
    icon: <Package className="w-6 h-6" />,
    color: "green",
  },
  {
    name: "Certificate of Origin",
    description: "Proof of manufacturing country",
    icon: <Globe className="w-6 h-6" />,
    color: "purple",
  },
  {
    name: "Export Declaration",
    description: "Government export compliance form",
    icon: <FileCheck className="w-6 h-6" />,
    color: "orange",
  },
] as const;

const recentDocs = [
  {
    order: "ORD-2448",
    document: "Commercial Invoice",
    destination: "UK",
    generated: "May 1, 2026",
    downloaded: true,
  },
  {
    order: "ORD-2447",
    document: "Export Declaration",
    destination: "Australia",
    generated: "Apr 30, 2026",
    downloaded: true,
  },
  {
    order: "ORD-2446",
    document: "Certificate of Origin",
    destination: "Canada",
    generated: "Apr 30, 2026",
    downloaded: false,
  },
];

export function ExportDocs() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = (orderId: string) => {
    setGenerating(true);
    setSelectedOrder(orderId);
    setTimeout(() => {
      setGenerating(false);
      alert("Export documents generated successfully!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/seller"
            className="flex items-center gap-2 text-[var(--electric-blue)] hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Seller Dashboard
          </Link>
          <h1 className="text-3xl text-[var(--navy)] mb-2">
            Export Documentation Center
          </h1>
          <p className="text-gray-600">
            Generate required customs and export documents for international
            orders
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {documentTemplates.map((template, index) => (
            <DocumentTemplate key={index} {...template} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl text-[var(--navy)]">
                  Pending Export Orders
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Generate documentation for these orders
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg text-[var(--navy)]">
                            {order.id}
                          </h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            Awaiting Documents
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Product:</span>{" "}
                            {order.product}
                          </div>
                          <div>
                            <span className="font-medium">Buyer:</span>{" "}
                            {order.buyer}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              {order.destination}
                            </span>
                            <span>${order.amount}</span>
                            <span>{order.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleGenerate(order.id)}
                        disabled={generating && selectedOrder === order.id}
                        className="px-6 py-3 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-sm disabled:opacity-50"
                      >
                        {generating && selectedOrder === order.id
                          ? "Generating..."
                          : "Generate All Documents"}
                      </button>
                      <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm">
                        Custom Selection
                      </button>
                    </div>

                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                      <p className="flex items-start gap-2">
                        <FileCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Documents will be auto-filled with product data,
                          dimensions, and origin country. Includes: Commercial
                          Invoice, Packing List, Certificate of Origin.
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg text-[var(--navy)] mb-4">
                Document Generator
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Our system automatically generates compliant export documents
                based on your product information and destination country
                regulations.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="text-[var(--navy)] mb-1">
                      Auto-filled Details
                    </div>
                    <div className="text-gray-600">
                      Product info, EAN, dimensions, weight
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="text-[var(--navy)] mb-1">
                      Country-Specific Forms
                    </div>
                    <div className="text-gray-600">
                      Compliant with destination regulations
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="text-[var(--navy)] mb-1">
                      Digital Signatures
                    </div>
                    <div className="text-gray-600">
                      Legally binding electronic documents
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="text-[var(--navy)] mb-1">
                      Instant PDF Export
                    </div>
                    <div className="text-gray-600">
                      Download and print immediately
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg text-[var(--navy)]">Recent Documents</h3>
              </div>

              <div className="divide-y divide-gray-200">
                {recentDocs.map((doc, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-sm text-[var(--navy)] mb-1">
                          {doc.document}
                        </div>
                        <div className="text-xs text-gray-600">
                          {doc.order} → {doc.destination}
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">{doc.generated}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <button className="w-full text-[var(--electric-blue)] hover:underline text-sm">
                  View All Documents
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentTemplate({
  name,
  description,
  icon,
  color,
}: {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div
        className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-[var(--navy)] mb-2">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
