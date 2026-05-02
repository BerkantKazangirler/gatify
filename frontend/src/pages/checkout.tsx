import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  Shield,
  FileText,
  CheckCircle,
  CreditCard,
  MapPin,} from "lucide-react";

export function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<
    "review" | "payment" | "customs" | "complete"
  >("review");
  const [generatingDocs, setGeneratingDocs] = useState(false);

  const product = {
    name: "Sony WH-1000XM5 Headphones",
    price: 299,
    shipping: 35,
    customs: 54,
    vat: 53,
    total: 441,
  };

  const handleProceed = () => {
    if (step === "review") {
      setStep("payment");
    } else if (step === "payment") {
      setGeneratingDocs(true);
      setTimeout(() => {
        setGeneratingDocs(false);
        setStep("customs");
      }, 2000);
    } else if (step === "customs") {
      setStep("complete");
      setTimeout(() => {
        navigate("/tracking");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-5xl mx-auto">
          <Link
            to={`/products/${id}`}
            className="flex items-center gap-2 text-[var(--electric-blue)] hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Product
          </Link>

          <div className="flex items-center gap-4">
            <StepIndicator
              number={1}
              label="Review"
              active={step === "review"}
              completed={step !== "review"}
            />
            <div className="h-0.5 w-12 bg-gray-300" />
            <StepIndicator
              number={2}
              label="Payment"
              active={step === "payment"}
              completed={step === "customs" || step === "complete"}
            />
            <div className="h-0.5 w-12 bg-gray-300" />
            <StepIndicator
              number={3}
              label="Customs"
              active={step === "customs"}
              completed={step === "complete"}
            />
            <div className="h-0.5 w-12 bg-gray-300" />
            <StepIndicator
              number={4}
              label="Complete"
              active={step === "complete"}
              completed={false}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        {step === "review" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-2xl text-[var(--navy)] mb-6">
                Order Summary
              </h2>

              <div className="flex gap-6 mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-5xl">
                  🎧
                </div>
                <div className="flex-1">
                  <h3 className="text-xl text-[var(--navy)] mb-2">
                    {product.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Base Price</span>
                      <span>${product.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping (Air)</span>
                      <span>${product.shipping}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customs Tax</span>
                      <span>${product.customs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT</span>
                      <span>${product.vat}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200 text-lg text-[var(--navy)]">
                      <span>Total</span>
                      <span className="font-medium">${product.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg text-[var(--navy)] mb-4">
                Shipping Address
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  className="col-span-2 px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                />
                <input
                  type="text"
                  placeholder="City"
                  className="px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                />
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full bg-[var(--electric-blue)] text-white py-4 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-lg"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-2xl text-[var(--navy)] mb-6">
                Payment Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-700">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-[var(--input-background)] focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                  />
                </div>
              </div>

              <div className="mt-6 bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <span className="text-gray-700">Total Amount</span>
                <span className="text-2xl text-[var(--navy)]">
                  ${product.total}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full bg-[var(--electric-blue)] text-white py-4 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-lg"
            >
              {generatingDocs ? "Processing Payment..." : "Complete Payment"}
            </button>
          </div>
        )}

        {step === "customs" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-[var(--electric-blue)]" />
                <div>
                  <h2 className="text-2xl text-[var(--navy)]">
                    Automated Customs Declaration
                  </h2>
                  <p className="text-gray-600">
                    Your documents are being prepared automatically
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <DocumentItem
                  icon={<FileText className="w-5 h-5" />}
                  title="Commercial Invoice"
                  status="Generated"
                  color="green"
                />
                <DocumentItem
                  icon={<FileText className="w-5 h-5" />}
                  title="Customs Declaration Form (CN23)"
                  status="Generated"
                  color="green"
                />
                <DocumentItem
                  icon={<Shield className="w-5 h-5" />}
                  title="Citizen ID Verification"
                  status="Verified"
                  color="green"
                />
                <DocumentItem
                  icon={<MapPin className="w-5 h-5" />}
                  title="Shipping Label & Tracking"
                  status="Ready"
                  color="green"
                />
              </div>

              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-800">
                    <div className="font-medium mb-1">
                      All customs documents ready!
                    </div>
                    <div>
                      Your pre-verified Citizen ID has accelerated this process.
                      Documents have been electronically submitted to customs
                      authorities.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full bg-[var(--electric-blue)] text-white py-4 rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-lg"
            >
              View Tracking
            </button>
          </div>
        )}

        {step === "complete" && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl text-[var(--navy)] mb-3">
              Order Confirmed!
            </h2>
            <p className="text-gray-600 mb-2">
              Your order has been placed successfully
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Redirecting to tracking page...
            </p>
            <div className="inline-flex gap-2">
              <div className="w-2 h-2 bg-[var(--electric-blue)] rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-[var(--electric-blue)] rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-[var(--electric-blue)] rounded-full animate-pulse delay-200" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          completed
            ? "bg-green-600 text-white"
            : active
              ? "bg-[var(--electric-blue)] text-white"
              : "bg-gray-200 text-gray-500"
        }`}
      >
        {completed ? <CheckCircle className="w-5 h-5" /> : number}
      </div>
      <span
        className={`text-sm ${active ? "text-[var(--navy)]" : "text-gray-500"}`}
      >
        {label}
      </span>
    </div>
  );
}

function DocumentItem({
  icon,
  title,
  status,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  status: string;
  color: "green" | "blue";
}) {
  const colorClasses = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="text-gray-600">{icon}</div>
        <span className="text-[var(--navy)]">{title}</span>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm ${colorClasses[color]}`}>
        {status}
      </span>
    </div>
  );
}
