import { useState } from 'react';

type Route = '/' | '/products' | '/help-center' | '/support' | '/signin' | '/get-started';

const issueTypes = [
  'Package Stuck in Customs',
  'Incorrect Tax Calculation',
  'Damaged or Defective Product',
  'Shipping Delay',
  'Refund Request',
  'Other Issue',
];

const steps = [
  {
    number: '1',
    title: 'Instant Confirmation',
    description: "You'll receive an email with your ticket number",
  },
  {
    number: '2',
    title: 'Team Review',
    description: 'Our experts review your case within 2-4 hours',
  },
  {
    number: '3',
    title: 'Resolution',
    description: "We'll provide a solution or next steps",
  },
];

const tips = ['Include your order ID for faster processing', 'Attach clear photos/screenshots', 'Use the same email tied to your order'];

export default function SupportPage({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const [selectedIssue, setSelectedIssue] = useState('Package Stuck in Customs');

  return (
    <section className="flex flex-1 flex-col bg-[#f8fafc] text-slate-900">
      <div className="border-b border-slate-200 bg-white px-6 py-8 lg:px-14">
        <a
          className="inline-flex items-center gap-2 text-[18px] font-medium text-[#169bf0] transition hover:text-[#0f7acc]"
          href="/help-center"
          onClick={(event) => {
            event.preventDefault();
            onNavigate('/help-center');
          }}
        >
          <span aria-hidden="true">←</span>
          Back to Help Center
        </a>

        <div className="mt-6 max-w-4xl">
          <h1 className="text-[38px] font-semibold tracking-[-0.04em] text-slate-900 sm:text-[46px]">Submit Support Ticket</h1>
          <p className="mt-4 text-[20px] leading-8 text-slate-600">
            Having trouble with your order? Our expert team is here to help resolve your issue.
          </p>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1360px] gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-6">
        <div className="space-y-8">
          <section className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-900">Contact Information</h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="text-[18px] font-medium text-slate-700">Full Name</span>
                <input
                  className="mt-3 h-[60px] w-full rounded-[18px] border border-slate-200 bg-[#fafbfd] px-5 text-[18px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#169bf0]"
                  placeholder="John Doe"
                  type="text"
                />
              </label>

              <label className="block">
                <span className="text-[18px] font-medium text-slate-700">Email Address</span>
                <input
                  className="mt-3 h-[60px] w-full rounded-[18px] border border-slate-200 bg-[#fafbfd] px-5 text-[18px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#169bf0]"
                  placeholder="john@example.com"
                  type="email"
                />
              </label>
            </div>

            <div className="mt-6">
              <label className="block">
                <span className="text-[18px] font-medium text-slate-700">Order ID (if applicable)</span>
                <input
                  className="mt-3 h-[60px] w-full rounded-[18px] border border-slate-200 bg-[#fafbfd] px-5 text-[18px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#169bf0]"
                  placeholder="ORD-2451"
                  type="text"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-900">Issue Details</h2>

            <div className="mt-6">
              <p className="text-[18px] font-medium text-slate-700">Issue Type</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {issueTypes.map((issue) => {
                  const active = selectedIssue === issue;
                  return (
                    <button
                      key={issue}
                      className={`flex min-h-[58px] items-center gap-3 rounded-[16px] border px-4 py-3 text-left text-[16px] font-medium transition ${active ? 'border-[#169bf0] bg-[#eef6ff] text-slate-900 shadow-[0_0_0_1px_rgba(22,155,240,0.15)]' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
                      type="button"
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${active ? 'border-[#169bf0] bg-[#169bf0] text-white' : 'border-slate-300 text-slate-400'}`}>
                        •
                      </span>
                      <span>{issue}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="text-[18px] font-medium text-slate-700">Subject</span>
                <input
                  className="mt-3 h-[60px] w-full rounded-[18px] border border-slate-200 bg-[#fafbfd] px-5 text-[18px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#169bf0]"
                  placeholder="Brief summary of your issue"
                  type="text"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="text-[18px] font-medium text-slate-700">Description</span>
                <textarea
                  className="mt-3 min-h-[180px] w-full rounded-[18px] border border-slate-200 bg-[#fafbfd] px-5 py-4 text-[18px] leading-8 text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#169bf0]"
                  placeholder="Tell us more about what happened..."
                />
              </label>
            </div>
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-white p-7 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-900">Attachments</h2>
            <p className="mt-3 text-[18px] leading-8 text-slate-600">
              Upload screenshots of stuck customs status, error messages, or damaged product photos (Max 5 files, 10MB each)
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[false, true, false].map((active, index) => (
                <button
                  key={index}
                  className={`flex min-h-[165px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed bg-[#fafbfd] text-slate-400 transition ${active ? 'border-[#169bf0] bg-[#eef6ff]' : 'border-slate-200 hover:border-slate-300'}`}
                  type="button"
                >
                  <span className="text-5xl leading-none">↑</span>
                  <span className="mt-4 text-[17px]">Upload File</span>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-[18px] border border-[#c5dcff] bg-[#eef5ff] px-5 py-4 text-[16px] leading-7 text-[#1646d3]">
              <span className="mr-3 text-[20px]">🖼️</span>
              For customs issues, include screenshots showing your tracking status and any notifications from customs authorities.
            </div>
          </section>

          <button className="h-[72px] w-full rounded-[20px] bg-[#16a4f2] text-[22px] font-semibold text-white shadow-[0_16px_32px_rgba(22,164,242,0.28)] transition hover:bg-[#1196e0]" type="button">
            Submit Support Ticket
          </button>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-slate-900">What to Expect</h2>
            <div className="mt-6 space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d9e9ff] text-[17px] font-medium text-[#169bf0]">
                    {step.number}
                  </div>
                  <div>
                    <p className="text-[18px] font-medium text-slate-900">{step.title}</p>
                    <p className="mt-1 text-[16px] leading-7 text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] bg-[linear-gradient(180deg,#122037_0%,#1b4b7a_52%,#169bf0_100%)] p-6 text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/80 text-2xl">
              !
            </div>
            <h2 className="mt-8 text-[24px] font-semibold tracking-[-0.03em]">Priority Support</h2>
            <p className="mt-4 text-[17px] leading-7 text-white/88">
              Customs-related issues are prioritized and typically resolved within 24 hours.
            </p>
            <div className="mt-6 space-y-3 text-[16px] text-white/90">
              <p>📧 Email: support@gatify.com</p>
              <p>⏰ Hours: 24/7 Support</p>
              <p>📞 Avg Response: 2.4 hours</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#f0df9b] bg-[#fffbe8] p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-slate-900">Quick Tips</h2>
            <ul className="mt-4 space-y-3 text-[16px] leading-7 text-slate-700">
              {tips.map((tip) => (
                <li key={tip}>✓ {tip}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
