import { useState } from "react";
import { Settings, DollarSign, Globe, Users, AlertCircle, TrendingUp, FileText, MessageSquare, Save } from "lucide-react";

type Tab = "rates" | "regulatory" | "support";

const customsRates = [
  { country: "USA", customs: 18, vat: 15, lastUpdated: "2026-04-15" },
  { country: "UK", customs: 20, vat: 20, lastUpdated: "2026-04-10" },
  { country: "Japan", customs: 15, vat: 10, lastUpdated: "2026-04-12" },
  { country: "Germany", customs: 19, vat: 19, lastUpdated: "2026-04-18" },
  { country: "South Korea", customs: 13, vat: 10, lastUpdated: "2026-04-20" },
];

const shippingRates = [
  { route: "USA → Local", air: 35, sea: 15 },
  { route: "UK → Local", air: 42, sea: 18 },
  { route: "Japan → Local", air: 38, sea: 16 },
  { route: "Germany → Local", air: 40, sea: 17 },
  { route: "South Korea → Local", air: 36, sea: 15 },
];

const regulatoryUpdates = [
  {
    id: 1,
    title: "EU Updates Electronics Import Regulations",
    date: "2026-05-01",
    severity: "high",
    description: "New CE marking requirements for electronics imported from non-EU countries. Affects all electronics categories.",
    impact: "High",
    action: "Update product compliance checks",
  },
  {
    id: 2,
    title: "USA Customs Tax Rate Adjustment",
    date: "2026-04-28",
    severity: "medium",
    description: "Annual adjustment of customs tax rates for consumer electronics. Rate increased from 17% to 18%.",
    impact: "Medium",
    action: "Update tax calculation engine",
  },
  {
    id: 3,
    title: "Japan Simplifies Personal Import Process",
    date: "2026-04-25",
    severity: "low",
    description: "New streamlined process for personal imports under ¥200,000. Reduces paperwork requirements.",
    impact: "Low",
    action: "Review and optimize Japan shipping flow",
  },
];

const supportTickets = [
  {
    id: 1,
    user: "john.doe@email.com",
    product: "Sony WH-1000XM5",
    issue: "Item stuck in customs for 7 days",
    status: "urgent",
    created: "2026-05-02",
    lastUpdate: "2 hours ago",
  },
  {
    id: 2,
    user: "jane.smith@email.com",
    product: "MacBook Pro 16\"",
    issue: "Customs tax calculation seems incorrect",
    status: "pending",
    created: "2026-05-01",
    lastUpdate: "1 day ago",
  },
  {
    id: 3,
    user: "mike.wilson@email.com",
    product: "Nintendo Switch OLED",
    issue: "Need assistance with customs petition",
    status: "resolved",
    created: "2026-04-30",
    lastUpdate: "3 days ago",
  },
];

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("rates");
  const [editingRates, setEditingRates] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[var(--navy)] to-[var(--navy-light)] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-10 h-10" />
            <div>
              <h1 className="text-3xl mb-1">Admin Panel</h1>
              <p className="text-gray-300">Global platform management & regulatory compliance</p>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <TabButton
              icon={<DollarSign className="w-5 h-5" />}
              label="Global Rates Manager"
              active={activeTab === "rates"}
              onClick={() => setActiveTab("rates")}
            />
            <TabButton
              icon={<Globe className="w-5 h-5" />}
              label="Regulatory Watch"
              active={activeTab === "regulatory"}
              onClick={() => setActiveTab("regulatory")}
            />
            <TabButton
              icon={<Users className="w-5 h-5" />}
              label="User Support"
              active={activeTab === "support"}
              onClick={() => setActiveTab("support")}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {activeTab === "rates" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-[var(--navy)] mb-2">Global Rates Manager</h2>
                <p className="text-gray-600">Update customs tax percentages and shipping costs</p>
              </div>
              <button
                onClick={() => setEditingRates(!editingRates)}
                className={`px-6 py-3 rounded-xl transition-colors flex items-center gap-2 ${
                  editingRates
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-[var(--electric-blue)] text-white hover:bg-[var(--electric-blue-dark)]"
                }`}
              >
                {editingRates ? (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Settings className="w-5 h-5" />
                    <span>Edit Rates</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg text-[var(--navy)]">Customs & Tax Rates</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Country</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Customs Tax (%)</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">VAT (%)</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Last Updated</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customsRates.map((rate, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-[var(--navy)]">{rate.country}</td>
                        <td className="px-6 py-4">
                          {editingRates ? (
                            <input
                              type="number"
                              defaultValue={rate.customs}
                              className="w-20 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                            />
                          ) : (
                            <span className="text-[var(--navy)]">{rate.customs}%</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingRates ? (
                            <input
                              type="number"
                              defaultValue={rate.vat}
                              className="w-20 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                            />
                          ) : (
                            <span className="text-[var(--navy)]">{rate.vat}%</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{rate.lastUpdated}</td>
                        <td className="px-6 py-4">
                          <button className="text-[var(--electric-blue)] hover:underline text-sm">
                            View History
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg text-[var(--navy)]">Shipping Rates (USD)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Route</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Air Freight</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Sea Freight</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {shippingRates.map((rate, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-[var(--navy)]">{rate.route}</td>
                        <td className="px-6 py-4">
                          {editingRates ? (
                            <input
                              type="number"
                              defaultValue={rate.air}
                              className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                            />
                          ) : (
                            <span className="text-[var(--navy)]">${rate.air}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingRates ? (
                            <input
                              type="number"
                              defaultValue={rate.sea}
                              className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]"
                            />
                          ) : (
                            <span className="text-[var(--navy)]">${rate.sea}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-[var(--electric-blue)] hover:underline text-sm">
                            Adjust
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "regulatory" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-[var(--navy)] mb-2">Regulatory Watch</h2>
              <p className="text-gray-600">Monitor global trade law changes and compliance requirements</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={<AlertCircle className="w-6 h-6" />}
                label="Active Alerts"
                value="3"
                color="red"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                label="Rate Changes"
                value="12"
                color="blue"
              />
              <StatCard
                icon={<FileText className="w-6 h-6" />}
                label="Updates (30d)"
                value="47"
                color="green"
              />
            </div>

            <div className="space-y-4">
              {regulatoryUpdates.map((update) => (
                <div
                  key={update.id}
                  className={`bg-white rounded-xl p-6 border-2 ${
                    update.severity === "high"
                      ? "border-red-200"
                      : update.severity === "medium"
                      ? "border-yellow-200"
                      : "border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg text-[var(--navy)]">{update.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            update.severity === "high"
                              ? "bg-red-100 text-red-700"
                              : update.severity === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {update.impact} Impact
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{update.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📅 {update.date}</span>
                        <span>•</span>
                        <span>📋 Action: {update.action}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button className="px-4 py-2 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-sm">
                      Review Details
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm">
                      Mark as Reviewed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "support" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-[var(--navy)] mb-2">User Support & Disputes</h2>
              <p className="text-gray-600">Manage users whose items are stuck in customs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={<AlertCircle className="w-6 h-6" />}
                label="Urgent Tickets"
                value="1"
                color="red"
              />
              <StatCard
                icon={<MessageSquare className="w-6 h-6" />}
                label="Pending"
                value="1"
                color="yellow"
              />
              <StatCard
                icon={<Users className="w-6 h-6" />}
                label="Resolved (7d)"
                value="23"
                color="green"
              />
            </div>

            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`bg-white rounded-xl p-6 border-2 ${
                    ticket.status === "urgent"
                      ? "border-red-200"
                      : ticket.status === "pending"
                      ? "border-yellow-200"
                      : "border-green-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg text-[var(--navy)]">{ticket.user}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            ticket.status === "urgent"
                              ? "bg-red-100 text-red-700"
                              : ticket.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {ticket.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Product:</span> {ticket.product}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Issue:</span> {ticket.issue}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Created: {ticket.created}</span>
                        <span>•</span>
                        <span>Last update: {ticket.lastUpdate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {ticket.status !== "resolved" && (
                      <>
                        <button className="px-4 py-2 bg-[var(--electric-blue)] text-white rounded-xl hover:bg-[var(--electric-blue-dark)] transition-colors text-sm">
                          Open Ticket
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm">
                          Generate Petition
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm">
                          Contact User
                        </button>
                      </>
                    )}
                    {ticket.status === "resolved" && (
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm">
                        View Resolution
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ icon, label, active, onClick }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-colors ${
        active
          ? "bg-white text-[var(--navy)]"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "red" | "blue" | "green" | "yellow";
}) {
  const colorClasses = {
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-3xl text-[var(--navy)]">{value}</div>
    </div>
  );
}
