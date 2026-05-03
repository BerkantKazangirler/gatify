import { useState } from "react";
import {
  MapPin,
  Package,
  Clock,
  AlertTriangle,
  FileDown,
  CheckCircle,
  Home,
} from "lucide-react";

type TimelineItem = {
  label: string;
  date: string;
  completed: boolean;
  location: string;
  current?: boolean;
  alert?: boolean;
};

type Shipment = {
  id: number;
  product: string;
  status: string;
  currentLocation: string;
  origin: string;
  destination: string;
  progress: number;
  eta: string;
  alert?: string;
  timeline: TimelineItem[];
};

const shipments: Shipment[] = [
  {
    id: 1,
    product: 'MacBook Pro 16"',
    status: "in_transit",
    currentLocation: "Singapore Port",
    origin: "USA",
    destination: "Your City",
    progress: 60,
    eta: "2 days",
    timeline: [
      {
        label: "Order Placed",
        date: "Apr 28",
        completed: true,
        location: "USA",
      },
      {
        label: "Dispatched",
        date: "Apr 29",
        completed: true,
        location: "USA Warehouse",
      },
      {
        label: "In Transit",
        date: "Apr 30",
        completed: true,
        location: "Singapore Port",
        current: true,
      },
      {
        label: "Customs Clearance",
        date: "Est. May 3",
        completed: false,
        location: "Local Customs",
      },
      {
        label: "Delivered",
        date: "Est. May 4",
        completed: false,
        location: "Your City",
      },
    ],
  },
  {
    id: 2,
    product: "Nintendo Switch OLED",
    status: "customs_alert",
    currentLocation: "Local Customs",
    origin: "Japan",
    destination: "Your City",
    progress: 85,
    eta: "Delayed",
    alert: "Item held for additional verification. Average delay: 3-5 days.",
    timeline: [
      {
        label: "Order Placed",
        date: "Apr 25",
        completed: true,
        location: "Japan",
      },
      {
        label: "Dispatched",
        date: "Apr 26",
        completed: true,
        location: "Japan Warehouse",
      },
      {
        label: "In Transit",
        date: "Apr 27",
        completed: true,
        location: "International Hub",
      },
      {
        label: "Customs Hold",
        date: "Apr 30",
        completed: true,
        location: "Local Customs",
        current: true,
        alert: true,
      },
      {
        label: "Delivered",
        date: "Pending",
        completed: false,
        location: "Your City",
      },
    ],
  },
  {
    id: 3,
    product: "Bose QuietComfort 45",
    status: "preparing",
    currentLocation: "USA Warehouse",
    origin: "USA",
    destination: "Your City",
    progress: 20,
    eta: "5 days",
    timeline: [
      {
        label: "Order Placed",
        date: "May 1",
        completed: true,
        location: "USA",
      },
      {
        label: "Preparing Shipment",
        date: "May 2",
        completed: true,
        location: "USA Warehouse",
        current: true,
      },
      {
        label: "In Transit",
        date: "Est. May 3",
        completed: false,
        location: "International",
      },
      {
        label: "Customs Clearance",
        date: "Est. May 6",
        completed: false,
        location: "Local Customs",
      },
      {
        label: "Delivered",
        date: "Est. May 7",
        completed: false,
        location: "Your City",
      },
    ],
  },
];

export function Tracking() {
  const [selectedShipment, setSelectedShipment] = useState<Shipment>(shipments[0]);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleGeneratePetition = () => {
    setGeneratingPdf(true);
    setTimeout(() => {
      setGeneratingPdf(false);
      alert("Gümrük dilekçesi PDF'i oluşturuldu ve indirildi!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl text-[var(--navy)] mb-2">
            Gönderileri Takip Et
          </h1>
          <p className="text-gray-600">
            Tahmine dayalı gümrük analizleriyle siparişlerini gerçek zamanlı
            izle
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {shipments.map((shipment) => (
            <button
              key={shipment.id}
              onClick={() => setSelectedShipment(shipment)}
              className={`bg-white rounded-xl p-4 border-2 transition-all text-left ${
                selectedShipment.id === shipment.id
                  ? "border-[var(--electric-blue)] shadow-lg"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-[var(--navy)]">{shipment.product}</h3>
                {shipment.status === "customs_alert" && (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{shipment.currentLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Tahmini varış: {shipment.eta}</span>
                </div>
              </div>

              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    shipment.status === "customs_alert"
                      ? "bg-red-600"
                      : "bg-[var(--electric-blue)]"
                  }`}
                  style={{ width: `${shipment.progress}%` }}
                />
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl text-[var(--navy)] mb-6">
              Gönderi Yol Haritası
            </h2>

            <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl mb-6 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full p-8">
                  <MapRoute
                    origin={selectedShipment.origin}
                    destination={selectedShipment.destination}
                    current={selectedShipment.currentLocation}
                    progress={selectedShipment.progress}
                    hasAlert={selectedShipment.status === "customs_alert"}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-gray-600">Çıkış Noktası</div>
                <div className="text-[var(--navy)]">
                  {selectedShipment.origin}
                </div>
              </div>

              <div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    selectedShipment.status === "customs_alert"
                      ? "bg-red-100"
                      : "bg-blue-100"
                  }`}
                >
                  <MapPin
                    className={`w-6 h-6 ${
                      selectedShipment.status === "customs_alert"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  />
                </div>
                <div className="text-gray-600">Mevcut Konum</div>
                <div className="text-[var(--navy)]">
                  {selectedShipment.currentLocation}
                </div>
              </div>

              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Home className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-gray-600">Varış Noktası</div>
                <div className="text-[var(--navy)]">
                  {selectedShipment.destination}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl text-[var(--navy)] mb-6">
              Zaman Çizelgesi ve Durum
            </h2>

            {selectedShipment.status === "customs_alert" && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-red-900 mb-1">
                      🚨 Gümrük Kırmızı Alarm
                    </h3>
                    <p className="text-sm text-red-800">
                      {selectedShipment.alert}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleGeneratePetition}
                  disabled={generatingPdf}
                  className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileDown className="w-5 h-5" />
                  <span>
                    {generatingPdf
                      ? "Generating..."
                      : "Auto-Generate Petition PDF"}
                  </span>
                </button>
              </div>
            )}

            <div className="space-y-4">
              {selectedShipment.timeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.alert
                          ? "bg-red-100"
                          : item.completed
                            ? "bg-green-100"
                            : "bg-gray-200"
                      }`}
                    >
                      {item.alert ? (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      ) : item.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                      )}
                    </div>
                    {index < selectedShipment.timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          item.completed ? "bg-green-300" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`${
                          item.current
                            ? "text-[var(--navy)]"
                            : item.completed
                              ? "text-gray-700"
                              : "text-gray-500"
                        }`}
                      >
                        {item.label}
                      </h3>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                    <div className="text-sm text-gray-600">{item.location}</div>
                    {item.current && (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                        <span>Current Status</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapRoute({
  origin,
  destination,
  current,
  progress,
  hasAlert,
}: {
  origin: string;
  destination: string;
  current: string;
  progress: number;
  hasAlert: boolean;
}) {
  console.log({ origin, destination, current, progress, hasAlert });
  return (
    <svg className="w-full h-full" viewBox="0 0 400 200">
      <defs>
        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop
            offset={`${progress}%`}
            stopColor={hasAlert ? "#dc2626" : "#0ea5e9"}
          />
          <stop offset={`${progress}%`} stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
      </defs>

      <path
        d="M 50 100 Q 125 60, 200 90 T 350 100"
        stroke="url(#routeGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      <circle cx="50" cy="100" r="8" fill="#10b981" />
      <text x="50" y="130" textAnchor="middle" fontSize="12" fill="#374151">
        {origin}
      </text>

      <circle
        cx={50 + (300 * progress) / 100}
        cy={100 + Math.sin((progress / 100) * Math.PI) * -20}
        r="10"
        fill={hasAlert ? "#dc2626" : "#0ea5e9"}
        className="animate-pulse"
      />

      <circle cx="350" cy="100" r="8" fill="#9333ea" />
      <text x="350" y="130" textAnchor="middle" fontSize="12" fill="#374151">
        {destination}
      </text>

      {hasAlert && (
        <g>
          <circle
            cx={50 + (300 * progress) / 100}
            cy={100 + Math.sin((progress / 100) * Math.PI) * -20}
            r="20"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
            opacity="0.5"
            className="animate-ping"
          />
        </g>
      )}
    </svg>
  );
}
