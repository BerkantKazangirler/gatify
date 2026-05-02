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
            Ticket Submitted!
          </h1>
          <p className="text-gray-600 mb-2">
            Your support ticket has been created successfully. Our team will
            review your case and respond within 2-4 hours.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            You'll receive email updates at{" "}
            <span className="text-[var(--navy)]">{formData.email}</span>
          </p>
          <div className="inline-flex gap-2 mb-4">
            <div className="w-2 h-2 bg-[var(--electric-blue)] rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-[var(--electric-blue)] rounded-full animate-pulse delay-100" />
            <div className="w-2 h-2 bg-[var(--electric-blue)] rounded-full animate-pulse delay-200" />
          </div>
          <p className="text-sm text-gray-500">Redirecting to Help Center...</p>
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
            Back to Help Center
          </Link>
          <h1 className="text-3xl text-[var(--navy)] mb-2">
            Submit Support Ticket
          </h1>
          <p className="text-gray-600">
            Having trouble with your order? Our expert team is here to help
            resolve your issue.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl text-[var(--navy)] mb-6">
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm text-gray-700">
                      Full Name
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
                      Email Address
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
                      Order ID{" "}
                      <span className="text-gray-500">(if applicable)</span>
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
                  Issue Details
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block mb-3 text-sm text-gray-700">
                      Issue Type
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
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => updateField("subject", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                      placeholder="Brief summary of your issue"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)] resize-none"
                      rows={6}
                      placeholder="Please provide as much detail as possible about your issue. Include tracking numbers, error messages, or any relevant information."
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl text-[var(--navy)] mb-3">Attachments</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Upload screenshots of stuck customs status, error messages, or
                  damaged product photos (Max 5 files, 10MB each)
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-[var(--electric-blue)] transition-colors cursor-pointer bg-gray-50"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Upload File</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                  <p className="flex items-start gap-2">
                    <Image className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      For customs issues, include screenshots showing your
                      tracking status and any notifications from customs
                      authorities.
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--electric-blue)] text-white py-4 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-lg"
              >
                Submit Support Ticket
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg text-[var(--navy)] mb-4">
                What to Expect
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    1
                  </div>
                  <div>
                    <div className="text-sm text-[var(--navy)] mb-1">
                      Instant Confirmation
                    </div>
                    <div className="text-xs text-gray-600">
                      You'll receive an email with your ticket number
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    2
                  </div>
                  <div>
                    <div className="text-sm text-[var(--navy)] mb-1">
                      Team Review
                    </div>
                    <div className="text-xs text-gray-600">
                      Our experts review your case within 2-4 hours
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    3
                  </div>
                  <div>
                    <div className="text-sm text-[var(--navy)] mb-1">
                      Resolution
                    </div>
                    <div className="text-xs text-gray-600">
                      We'll provide a solution or next steps
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--navy)] to-[var(--electric-blue)] rounded-xl p-6 text-white">
              <AlertCircle className="w-8 h-8 mb-4" />
              <h3 className="text-lg mb-2">Priority Support</h3>
              <p className="text-sm text-gray-300 mb-4">
                Customs-related issues are prioritized and typically resolved
                within 24 hours.
              </p>
              <div className="space-y-2 text-sm">
                <div>📧 Email: support@gatify.com</div>
                <div>⏰ Hours: 24/7 Support</div>
                <div>📞 Avg Response: 2.4 hours</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg text-[var(--navy)] mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Include your order ID for faster processing</li>
                <li>✓ Attach clear photos/screenshots</li>
                <li>✓ Mention specific error messages</li>
                <li>✓ Note when the issue started</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
