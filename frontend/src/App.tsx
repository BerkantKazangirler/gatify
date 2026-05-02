import { useEffect, useState } from 'react';
import ProductsPage from './pages/ProductsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import SupportPage from './pages/SupportPage';
import SignInPage from './pages/SignInPage';
import RegisterPage from './pages/RegisterPage';

const popularCategories = ['Electronics', 'Fashion', 'Home & Garden'];

const routes = ['/', '/products', '/help-center', '/support', '/signin', '/login', '/register', '/get-started'] as const;

type Route = (typeof routes)[number];

function getRoute(pathname: string): Route {
  return (routes as readonly string[]).includes(pathname) ? (pathname as Route) : '/';
}

function PageShell({
  activeRoute,
  onNavigate,
  children,
}: {
  activeRoute: Route;
  onNavigate: (route: Route) => void;
  children: React.ReactNode;
}) {
  const navClass = 'transition hover:text-slate-900';

  const linkProps = (route: Route) => ({
    href: route,
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onNavigate(route);
    },
  });

  return (
    <main className="min-h-screen bg-[#eef2f7] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1365px] flex-col bg-white">
        <header className="flex h-[82px] items-center justify-between border-b border-slate-200 px-8 lg:px-16">
          <a className="flex items-center gap-3" href="/" onClick={(event) => { event.preventDefault(); onNavigate('/'); }}>
            <div className="flex h-10 w-10 items-center justify-center text-cyan-500">
              <svg aria-hidden="true" className="h-9 w-9" fill="none" viewBox="0 0 32 32">
                <path d="M16 3 4 9v14l12 6 12-6V9L16 3Z" stroke="currentColor" strokeWidth="2.4" />
                <path d="M16 16v13" stroke="currentColor" strokeWidth="2.4" />
                <path d="M4 9l12 7 12-7" stroke="currentColor" strokeWidth="2.4" />
              </svg>
            </div>
            <span className="text-[24px] font-medium tracking-[-0.02em] text-slate-800">Gatify</span>
          </a>

          <nav className="hidden items-center gap-10 text-[15px] font-medium text-slate-500 md:flex">
            <a {...linkProps('/products')} className={`${navClass} ${activeRoute === '/products' ? 'text-slate-900' : ''}`}>
              Products
            </a>
            <a {...linkProps('/help-center')} className={`${navClass} ${activeRoute === '/help-center' ? 'text-slate-900' : ''}`}>
              Help Center
            </a>
            <a {...linkProps('/support')} className={`${navClass} ${activeRoute === '/support' ? 'text-slate-900' : ''}`}>
              Support
            </a>
          </nav>

          <div className="flex items-center gap-5 text-[15px] font-medium">
            <a {...linkProps('/signin')} className="text-slate-700 transition hover:text-slate-900">
              Sign In
            </a>
            <a
              {...linkProps('/register')}
              className="rounded-full bg-[#16a4f2] px-6 py-3 text-white shadow-[0_10px_24px_rgba(22,164,242,0.26)] transition hover:bg-[#1196e0]"
            >
              Get Started
            </a>
          </div>
        </header>

        {children}

        <footer className="bg-[#0d1727] px-6 py-12 text-slate-200 lg:px-16">
          <div className="mx-auto max-w-[1365px]">
            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] xl:gap-16">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center text-cyan-500">
                    <svg aria-hidden="true" className="h-9 w-9" fill="none" viewBox="0 0 32 32">
                      <path d="M16 3 4 9v14l12 6 12-6V9L16 3Z" stroke="currentColor" strokeWidth="2.4" />
                      <path d="M16 16v13" stroke="currentColor" strokeWidth="2.4" />
                      <path d="M4 9l12 7 12-7" stroke="currentColor" strokeWidth="2.4" />
                    </svg>
                  </div>
                  <span className="text-[26px] font-medium tracking-[-0.02em] text-white">Gatify</span>
                </div>

                <p className="mt-5 max-w-[320px] text-[18px] leading-8 text-slate-400">
                  Global commerce made simple with automated customs and price arbitrage.
                </p>
              </div>

              <div>
                <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-white">Platform</h2>
                <ul className="mt-5 space-y-4 text-[18px] text-slate-400">
                  <li>
                    <a className="transition hover:text-white" href="#" onClick={(event) => event.preventDefault()}>
                      Browse Products
                    </a>
                  </li>
                  <li>
                    <a className="transition hover:text-white" href="#" onClick={(event) => event.preventDefault()}>
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a className="transition hover:text-white" href="#" onClick={(event) => event.preventDefault()}>
                      Become a Seller
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-white">Support</h2>
                <ul className="mt-5 space-y-4 text-[18px] text-slate-400">
                  <li>
                    <a className="transition hover:text-white" href="#" onClick={(event) => event.preventDefault()}>
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a className="transition hover:text-white" href="#" onClick={(event) => event.preventDefault()}>
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a className="transition hover:text-white" href="#" onClick={(event) => event.preventDefault()}>
                      Customs Guide
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-white">Legal</h2>
                <ul className="mt-5 space-y-4 text-[18px] text-slate-400">
                  <li>
                    <a className="transition hover:text-white" href="#" onClick={(event) => event.preventDefault()}>
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a className="transition hover:text-white" href="#" onClick={(event) => event.preventDefault()}>
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a className="transition hover:text-white" href="#" onClick={(event) => event.preventDefault()}>
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="my-10 border-t border-white/8" />

            <p className="pb-2 text-center text-[18px] text-slate-400">© 2026 Gatify. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

function HeroHome({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return (
    <section className="relative flex-1 overflow-hidden bg-[linear-gradient(180deg,#122037_0%,#1c3553_58%,#229be4_100%)] px-8 pb-14 pt-16 text-white lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_70%,rgba(34,155,228,0.95),transparent_15%),radial-gradient(circle_at_78%_28%,rgba(255,255,255,0.06),transparent_24%)]" />
      <div className="relative max-w-[720px] pt-12">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[14px] font-medium text-white/90 backdrop-blur-sm">
          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/45 text-[10px] leading-none">◈</span>
          <span>Cross-Border Commerce Platform</span>
        </div>

        <h1 className="max-w-[760px] text-[76px] font-medium leading-[0.96] tracking-[-0.055em] text-white lg:text-[82px]">
          Shop Globally,
          <span className="block text-[#45b9f7]">Save Massively</span>
        </h1>

        <p className="mt-7 max-w-[760px] text-[21px] leading-[1.45] text-white/88 lg:text-[22px]">
          Compare prices worldwide, navigate customs automatically, and save up to 40% on premium products.
        </p>

        <div className="mt-9 max-w-[560px] rounded-[18px] bg-white p-2 shadow-[0_14px_28px_rgba(0,0,0,0.24)]">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-3 pl-4 text-slate-400">
              <svg aria-hidden="true" className="h-7 w-7 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m1.85-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
              </svg>
              <input
                aria-label="Search for products worldwide"
                className="h-[60px] w-full border-none bg-transparent text-[18px] text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Search for products worldwide..."
                type="text"
              />
            </div>

            <button className="h-[44px] rounded-[16px] bg-[#16a4f2] px-7 text-[17px] font-semibold text-white transition hover:bg-[#1196e0]" type="button" onClick={() => onNavigate('/products')}>
              Explore
            </button>
          </div>
        </div>

        <div className="mt-7 flex items-center gap-3 text-[14px]">
          <span className="mr-2 text-white/88">Popular:</span>
          {popularCategories.map((category) => (
            <button
              key={category}
              className="rounded-full bg-white/14 px-4 py-2 font-semibold text-white/92 backdrop-blur-sm transition hover:bg-white/24"
              type="button"
              onClick={() => onNavigate('/products')}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function SimplePage({ title, description, accent, onNavigate }: { title: string; description: string; accent: string; onNavigate: (route: Route) => void }) {
  return (
    <section className="flex flex-1 items-center justify-center px-8 py-16 lg:px-16">
      <div className="w-full max-w-4xl rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">{accent}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-full bg-[#16a4f2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1196e0]" type="button" onClick={() => onNavigate('/')}>Go home</button>
          <button className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900" type="button" onClick={() => onNavigate('/products')}>
            View products
          </button>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => getRoute(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (nextRoute: Route) => {
    if (nextRoute === route) {
      return;
    }

    window.history.pushState({}, '', nextRoute);
    setRoute(nextRoute);
  };

  return (
    <PageShell activeRoute={route} onNavigate={navigate}>
      {route === '/' ? (
        <HeroHome onNavigate={navigate} />
      ) : route === '/products' ? (
        <ProductsPage onNavigate={navigate} />
      ) : route === '/help-center' ? (
        <HelpCenterPage onNavigate={navigate} />
      ) : route === '/support' ? (
        <SupportPage onNavigate={navigate} />
      ) : route === '/signin' || route === '/login' ? (
        <SignInPage onNavigate={navigate} />
      ) : route === '/register' || route === '/get-started' ? (
        <RegisterPage onNavigate={navigate} />
      ) : (
        <SimplePage accent="Get Started" description="Create your account and begin browsing or selling with cross-border checkout built in." onNavigate={navigate} title="Get Started" />
      )}
    </PageShell>
  );
}
