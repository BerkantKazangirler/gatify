type Route = '/' | '/products' | '/help-center' | '/support' | '/signin' | '/get-started';

const productCards = [
  {
    name: 'Sony WH-1000XM5 Headphones',
    location: 'USA',
    risk: 'Low Risk',
    price: '$299',
    localPrice: '$349',
    symbol: '🎧',
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    location: 'UK',
    risk: 'Low Risk',
    price: '$549',
    localPrice: '$799',
    symbol: '🧹',
  },
  {
    name: 'Apple AirPods Pro 2',
    location: 'Japan',
    risk: 'Medium Risk',
    price: '$189',
    localPrice: '$279',
    symbol: '🎵',
  },
  {
    name: 'Nintendo Switch OLED',
    location: 'Singapore',
    risk: 'Low Risk',
    price: '$319',
    localPrice: '$389',
    symbol: '🎮',
  },
  {
    name: 'Fujifilm X-T5 Camera',
    location: 'Germany',
    risk: 'Medium Risk',
    price: '$1,599',
    localPrice: '$1,899',
    symbol: '📷',
  },
  {
    name: 'Samsung Galaxy Watch',
    location: 'South Korea',
    risk: 'Low Risk',
    price: '$219',
    localPrice: '$299',
    symbol: '⌚',
  },
];

export default function ProductsPage({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return (
    <section className="flex flex-1 overflow-hidden bg-white">
      <aside className="hidden w-[260px] shrink-0 flex-col bg-[#111a2c] text-white lg:flex">
        <div className="flex h-[164px] flex-col justify-center border-b border-white/8 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center text-cyan-400">
              <svg aria-hidden="true" className="h-10 w-10" fill="none" viewBox="0 0 32 32">
                <path d="M16 3 4 9v14l12 6 12-6V9L16 3Z" stroke="currentColor" strokeWidth="2.4" />
                <path d="M16 16v13" stroke="currentColor" strokeWidth="2.4" />
                <path d="M4 9l12 7 12-7" stroke="currentColor" strokeWidth="2.4" />
              </svg>
            </div>
            <div>
              <p className="text-[24px] font-semibold tracking-[-0.03em]">Gatify</p>
              <p className="text-sm text-slate-300/80">Global Trade Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col px-4 py-5 text-[15px]">
          <a className="mb-3 flex items-center gap-3 rounded-[18px] px-4 py-4 text-slate-200/85 transition hover:bg-white/6 hover:text-white" href="/" onClick={(event) => { event.preventDefault(); onNavigate('/'); }}>
            <span className="text-xl">▦</span>
            <span>Dashboard</span>
          </a>

          <a className="mb-3 flex items-center gap-3 rounded-[18px] bg-[#16a4f2] px-4 py-4 font-medium text-white shadow-[0_12px_24px_rgba(22,164,242,0.25)]" href="/products" onClick={(event) => { event.preventDefault(); onNavigate('/products'); }}>
            <span className="text-xl">⌕</span>
            <span>Discover Products</span>
          </a>

          <a className="mb-3 flex items-center gap-3 rounded-[18px] px-4 py-4 text-slate-200/85 transition hover:bg-white/6 hover:text-white" href="/support" onClick={(event) => { event.preventDefault(); onNavigate('/support'); }}>
            <span className="text-xl">◉</span>
            <span>Track Shipments</span>
          </a>

          <div className="my-4 border-t border-white/8" />

          <a className="mb-3 flex items-center gap-3 rounded-[18px] px-4 py-4 text-slate-200/85 transition hover:bg-white/6 hover:text-white" href="/help-center" onClick={(event) => { event.preventDefault(); onNavigate('/help-center'); }}>
            <span className="text-xl">?</span>
            <span>Help Center</span>
          </a>

          <a className="mb-3 flex items-center gap-3 rounded-[18px] px-4 py-4 text-slate-200/85 transition hover:bg-white/6 hover:text-white" href="/signin" onClick={(event) => { event.preventDefault(); onNavigate('/signin'); }}>
            <span className="text-xl">☰</span>
            <span>Support</span>
          </a>

          <div className="mt-auto rounded-[20px] bg-[#0d1525] px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#16a4f2] text-lg font-semibold text-white">U</div>
              <div>
                <p className="text-[15px] font-medium text-white">User Account</p>
                <p className="text-sm text-slate-300/70">Buyer Role</p>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-[#fafbfe]">
        <div className="border-b border-slate-200 bg-white px-6 py-6 lg:px-8">
          <h1 className="text-[30px] font-semibold tracking-[-0.03em] text-slate-900 lg:text-[34px]">Discover Global Products</h1>

          <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center">
            <label className="flex h-[46px] flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 text-slate-400">
              <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m1.85-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
              </svg>
              <input
                aria-label="Search products"
                className="w-full border-none bg-transparent text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Search products..."
                type="text"
              />
            </label>

            <div className="flex gap-3">
              <button className="h-[46px] rounded-full border border-slate-200 bg-white px-5 text-[15px] text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900" type="button">
                All Categories
              </button>
              <button className="h-[46px] rounded-full border border-slate-200 bg-white px-5 text-[15px] text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900" type="button">
                All Risk Levels
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-[15px] text-slate-500">
            <span className="flex items-center gap-2">
              <span className="text-slate-400">⎇</span>
              8 products found
            </span>
            <span>•</span>
            <span>Average savings: 30%</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {productCards.map((product) => (
              <article key={product.name} className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                <div className="flex h-[230px] items-center justify-center bg-[linear-gradient(180deg,#eff2f8_0%,#e8ecf4_100%)] text-7xl text-slate-400">
                  <span>{product.symbol}</span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="max-w-[70%] text-[18px] font-semibold leading-7 text-slate-900">{product.name}</h2>
                    <span className={`rounded-full px-3 py-1 text-[12px] font-medium ${product.risk === 'Low Risk' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-700'}`}>
                      {product.risk}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-[13px] text-slate-500">
                    <span>⌖</span>
                    <span>{product.location}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-[14px] text-slate-500">
                    <div>
                      <p>Global Price</p>
                      <p className="mt-1 text-[20px] font-semibold text-[#169bf0]">{product.price}</p>
                    </div>
                    <div>
                      <p>Local Price</p>
                      <p className="mt-1 text-[18px] text-slate-400 line-through">{product.localPrice}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
