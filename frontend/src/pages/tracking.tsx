import { useState, useMemo } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  MapPin,
  Package,
  Clock,
  AlertTriangle,
  FileDown,
  CheckCircle,
  Activity,
  Calendar,
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
  const [selectedShipment, setSelectedShipment] = useState<Shipment>(
    shipments[0],
  );
  const [activeTab, setActiveTab] = useState<"map" | "analysis">("map");
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [previewCoords, setPreviewCoords] = useState<[number, number] | null>(
    null,
  );
  const [activeStepColor, setActiveStepColor] = useState<string | null>(null);

  const handleGeneratePetition = () => {
    setGeneratingPdf(true);
    setTimeout(() => {
      setGeneratingPdf(false);
      alert("Gümrük dilekçesi PDF'i oluşturuldu ve indirildi!");
    }, 2000);
  };
  const deliveryAnalysis = useMemo(() => {
    const orderDate = new Date(selectedShipment.timeline[0].date + ", 2026");
    const origin = COORDINATES[selectedShipment.origin];
    const dest = COORDINATES[selectedShipment.destination];

    return [
      {
        label: "Sipariş Alınma",
        date: orderDate,
        days: 0,
        color: "#22c55e", // Yeşil
        coords: origin,
      },
      {
        label: "Uluslararası Transfer",
        date: new Date(orderDate.getTime() + 3 * 86400000),
        days: 3,
        color: "#3b82f6", // Mavi
        coords: COORDINATES["International Hub"],
      },
      {
        label: "Gümrük İşlemleri",
        date: new Date(orderDate.getTime() + 6 * 86400000),
        days: 3,
        color: "#f59e0b", // Turuncu
        coords: COORDINATES["Local Customs"],
      },
      {
        label: "Tahmini Teslim",
        date: new Date(orderDate.getTime() + 10 * 86400000),
        days: 4,
        color: "#8b5cf6", // Mor
        coords: dest,
      },
    ];
  }, [selectedShipment]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-3xl text-[var(--navy)] mb-2">
              Gönderi Merkezi
            </h1>
            <p className="text-gray-600">
              Yapay zeka destekli lojistik analizi
            </p>
          </div>

          {/* Sekme Değiştirici (Tab Switcher) */}
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setActiveTab("map")}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${activeTab === "map" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
            >
              <Activity className="w-4 h-4" /> Canlı Takip
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${activeTab === "analysis" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
            >
              <Calendar className="w-4 h-4" /> Varış Analizi
            </button>
          </div>
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
          {/* SOL TARAF: Tab İçeriği */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            {activeTab === "analysis" ? (
              <div className="animate-in slide-in-from-left duration-300">
                <h2 className="text-xl font-bold mb-6 text-blue-600">
                  📍 Tahmini Varış Analizi
                </h2>
                <div className="space-y-4">
                  {deliveryAnalysis.map((step, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setPreviewCoords(step.coords);
                        setActiveStepColor(step.color);
                      }}
                      className="group flex items-center gap-5 p-5 bg-gray-50 hover:bg-blue-50 rounded-2xl border-2 border-transparent hover:border-blue-200 transition-all cursor-pointer shadow-sm"
                      style={{
                        backgroundColor:
                          activeStepColor === step.color
                            ? `${step.color}10`
                            : "",
                        borderColor:
                          activeStepColor === step.color
                            ? step.color
                            : "transparent",
                      }}
                    >
                      {/* Gün Sayısı Balonu */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-white font-bold transition-transform group-hover:scale-110"
                        style={{ backgroundColor: step.color }}
                      >
                        +{step.days}g
                      </div>

                      {/* Aşama Bilgileri */}
                      <div className="flex-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          {step.label}
                        </div>
                        <div className="text-lg font-semibold text-gray-800">
                          {step.date.toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                          })}
                        </div>
                      </div>

                      {/* İkon */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Activity className="w-5 h-5 text-gray-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-xl font-bold mb-8 text-[var(--navy)]">
                  📦 İşlem Geçmişi
                </h2>{" "}
                <div className="space-y-6">
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
                            <span className="text-sm text-gray-500">
                              {item.date}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.location}
                          </div>
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
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm sticky top-8 h-[600px] flex flex-col">
            <div className="p-4">
              <h2 className="text-xl font-bold">
                {activeTab === "map"
                  ? "Gerçek Zamanlı Rota"
                  : "AI Varış Projeksiyonu"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {activeTab === "map"
                  ? "Kargonun şu anki fiziksel konumu gösteriliyor."
                  : "Analiz adımlarına göre kargonun olacağı muhtemel konumlar."}
              </p>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-gray-100">
              {/* 
                  Burada kritik nokta: activeTab'e göre haritaya farklı proplar geçiyoruz.
                  'Analysis' sekmesinde marker sadece biz üzerine geldiğimizde (previewCoords) oynar.
                */}
              <MapRoute
                origin={selectedShipment.origin}
                destination={selectedShipment.destination}
                current={
                  activeTab === "analysis"
                    ? previewCoords || COORDINATES[selectedShipment.origin] // Analizde varsayılan çıkış noktası
                    : COORDINATES[selectedShipment.currentLocation] // Canlı takipte mevcut konum
                }
                hasAlert={selectedShipment.status === "customs_alert"}
                isPreview={activeTab === "analysis"}
                activeStepColor={activeStepColor}
              />
            </div>

            {/* Analiz sekmesinde haritanın altına bir ipucu ekleyelim */}
            {activeTab === "analysis" && (
              <div className="p-4 text-center">
                <p className="text-xs text-blue-600 font-medium">
                  💡 Soldaki aşamaların üzerine gelerek haritayı simüle edin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const COORDINATES: Record<string, [number, number]> = {
  USA: [-95.7129, 37.0902],
  "USA Warehouse": [-118.2437, 34.0522],
  "Singapore Port": [103.8198, 1.3521],
  "Local Customs": [28.9784, 41.0082],
  "Your City": [32.8597, 39.9334],
  Japan: [138.2529, 36.2048],
  "Japan Warehouse": [139.6917, 35.6895],
  "International Hub": [55.2708, 25.2048],
  International: [55.2708, 25.2048],
};

function MapRoute({
  origin,
  destination,
  current,
  hasAlert,
  isPreview,
  activeStepColor,
  activeIndex,
}: any) {
  const originCoords = COORDINATES[origin] || [0, 0];
  const destCoords = COORDINATES[destination] || [0, 0];

  const currentCoords = Array.isArray(current)
    ? current
    : COORDINATES[current] || originCoords;

  // Rota Verisi: Hata veren 'properties: {}' alanı eklendi
  const dynamicPathData: GeoJSON.Feature<GeoJSON.LineString> = useMemo(() => {
    const allPoints = [
      originCoords,
      COORDINATES["International Hub"] || originCoords,
      COORDINATES["Local Customs"] || destCoords,
      destCoords,
    ];

    let coords = [];
    if (isPreview && activeIndex !== null) {
      coords = allPoints.slice(0, activeIndex + 1);
    } else {
      coords = [originCoords, currentCoords];
    }

    return {
      type: "Feature",
      properties: {}, // KRİTİK: Hatanın çözümü için boş bir obje ekledik
      geometry: {
        type: "LineString",
        coordinates: coords.length > 1 ? coords : [originCoords, originCoords],
      },
    };
  }, [originCoords, destCoords, currentCoords, activeIndex, isPreview]);

  return (
    <Map
      {...({
        initialViewState: {
          longitude: currentCoords[0],
          latitude: currentCoords[1],
          zoom: isPreview ? 3 : 1.5,
        },
      } as any)}
      mapStyle="mapbox://styles/mapbox/light-v11"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
    >
      {/* Marker Kısmı */}
      <Marker
        longitude={currentCoords[0]}
        latitude={currentCoords[1]}
        anchor="bottom"
      >
        <div className="relative flex items-center justify-center transition-all duration-500 scale-125">
          <div
            className="absolute w-12 h-12 rounded-full animate-ping opacity-25"
            style={{
              backgroundColor:
                activeStepColor || (hasAlert ? "#ef4444" : "#3b82f6"),
            }}
          />
          <div
            className="w-10 h-10 rounded-xl shadow-2xl border-4 border-white flex items-center justify-center transition-all duration-500"
            style={{
              backgroundColor:
                activeStepColor || (hasAlert ? "#dc2626" : "#2563eb"),
            }}
          >
            <Package className="w-5 h-5 text-white" />
          </div>
        </div>
      </Marker>

      {/* Rota Çizgisi: Key prop'u eski lineların kalmasını engeller */}
      <Source
        id="dynamicRoute"
        key={isPreview ? `analysis-${activeIndex}` : "live"}
        type="geojson"
        data={dynamicPathData}
      >
        <Layer
          id="route-line"
          type="line"
          paint={{
            "line-color": activeStepColor || (hasAlert ? "#dc2626" : "#3b82f6"),
            "line-width": 4,
            "line-dasharray": isPreview ? [2, 1] : [1, 0],
          }}
        />
      </Source>
    </Map>
  );
}