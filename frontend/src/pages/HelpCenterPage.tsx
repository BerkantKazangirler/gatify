import { useState } from 'react';

export type Route = '/' | '/products' | '/help-center' | '/support' | '/signin' | '/get-started';

type Category = {
  title: string;
  articles: number;
  icon: string;
  active?: boolean;
};

type AccordionItem = {
  question: string;
  answer: string;
};

const categories: Category[] = [
  { title: 'Customs Regulations', articles: 12, icon: '🛡️', active: true },
  { title: 'Shipping Policies', articles: 8, icon: '📦' },
  { title: 'Payments & Pricing', articles: 6, icon: '💳' },
  { title: 'Refunds & Returns', articles: 5, icon: '🔄' },
];

const accordionItems: AccordionItem[] = [
  {
    question: 'How does Gatify handle customs clearance?',
    answer:
      'Gatify automates customs declaration using your pre-verified Citizen ID. We generate all required forms (Commercial Invoice, CN23) and submit them electronically to customs authorities. Our system calculates duties and taxes upfront, so there are no surprises. Average clearance time is 2–3 days.',
  },
  {
    question: 'What if my package gets stuck in customs?',
    answer:
      'Our support team monitors customs status and can provide follow-up documentation, shipment updates, and escalation guidance if a parcel is delayed.',
  },
  {
    question: 'Are customs taxes and VAT included in the price?',
    answer:
      'Yes. Gatify shows the landed cost before checkout so you can compare products with duties, taxes, and shipping already included.',
  },
  {
    question: 'Which countries does Gatify support for customs?',
    answer:
      'We currently support a broad set of buyer and seller corridors across North America, Europe, and Asia, and we expand coverage continuously.',
  },
];

const popularArticles = [
  'How to calculate total import costs',
  'Understanding the Worth It? score',
  'What to do if customs holds my package',
  'Difference between air and sea freight',
  'How to become a seller on Gatify',
];

export default function HelpCenterPage({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="flex flex-1 flex-col bg-white">
      <div className="bg-[linear-gradient(180deg,#123155_0%,#1d6ea6_56%,#149be2_100%)] px-6 pb-14 pt-14 text-white lg:px-12">
        <div className="mx-auto flex max-w-[1120px] flex-col items-center text-center">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl backdrop-blur-sm">
            ?
          </div>
          <h1 className="text-[40px] font-semibold tracking-[-0.04em] sm:text-[56px]">How can we help you?</h1>
          <p className="mt-4 text-[18px] text-white/85 sm:text-[24px]">Search our knowledge base or browse categories below</p>

          <div className="mt-10 w-full max-w-[840px] rounded-[24px] bg-white px-5 py-4 shadow-[0_16px_38px_rgba(0,0,0,0.18)] sm:px-6 sm:py-5">
            <div className="flex items-center gap-4 text-slate-400">
              <svg aria-hidden="true" className="h-8 w-8 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m1.85-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
              </svg>
              <input
                aria-label="Search help articles"
                className="h-[44px] w-full border-none bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400 sm:text-[20px]"
                placeholder="Search for help articles..."
                type="text"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1360px] gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:px-6">
        <div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.title}
                className={`rounded-[24px] border p-6 text-left transition ${category.active ? 'border-[#169bf0] bg-[#eef5ff] shadow-[0_0_0_1px_rgba(22,155,240,0.2)]' : 'border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:border-slate-300'}`}
                type="button"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${category.active ? 'bg-[#169bf0] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {category.icon}
                </div>
                <h2 className="mt-8 text-[21px] font-semibold tracking-[-0.02em] text-slate-900">{category.title}</h2>
                <p className="mt-2 text-[16px] text-slate-600">{category.articles} articles</p>
              </button>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-900">Customs Regulations</h2>

            <div className="mt-6 space-y-4">
              {accordionItems.map((item, index) => {
                const open = index === openIndex;
                return (
                  <article key={item.question} className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                    <button
                      className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left"
                      type="button"
                      onClick={() => setOpenIndex(index)}
                    >
                      <span className="text-[20px] font-medium leading-8 text-slate-900">{item.question}</span>
                      <span className="text-2xl text-slate-500">{open ? '⌃' : '⌄'}</span>
                    </button>
                    {open ? <div className="border-t border-slate-200 px-6 py-5 text-[17px] leading-8 text-slate-700">{item.answer}</div> : null}
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[24px] bg-[linear-gradient(180deg,#11203f_0%,#145582_54%,#1d9ae2_100%)] p-6 text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/70 text-2xl">
              💬
            </div>
            <h2 className="mt-8 text-[26px] font-semibold tracking-[-0.03em]">Still need help?</h2>
            <p className="mt-4 max-w-[280px] text-[18px] leading-8 text-white/88">Can't find what you're looking for? Our support team is here to help.</p>
            <button className="mt-8 w-full rounded-full bg-white px-6 py-4 text-[18px] font-medium text-slate-900 transition hover:bg-slate-100" type="button" onClick={() => onNavigate('/support')}>
              Contact Support
            </button>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-slate-900">Popular Articles</h2>
            <ul className="mt-6 space-y-4 text-[16px] leading-7 text-[#169bf0]">
              {popularArticles.map((article) => (
                <li key={article}>
                  <a className="transition hover:text-[#0f7acc]" href="#">
                    → {article}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-[#b9d7ff] bg-[#eef5ff] p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-slate-900">Quick Stats</h2>
            <div className="mt-6 space-y-5 text-[16px] text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <span>Avg. Response Time</span>
                <span className="text-[18px] font-semibold text-slate-900">2.4 hours</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Resolution Rate</span>
                <span className="text-[18px] font-semibold text-slate-900">96%</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
