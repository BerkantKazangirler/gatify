type Route = '/' | '/products' | '/help-center' | '/support' | '/signin' | '/login' | '/register' | '/get-started';

export default function RegisterPage({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return (
    <section className="flex flex-1 items-center justify-center bg-[linear-gradient(180deg,#0f1a2c_0%,#111d33_55%,#16223a_100%)] px-6 py-10 text-slate-900 lg:px-10">
      <div className="w-full max-w-[430px] text-center text-white">
        <div className="flex items-center justify-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center text-[#18a4f2]">
            <svg aria-hidden="true" className="h-11 w-11" fill="none" viewBox="0 0 32 32">
              <path d="M16 3 4 9v14l12 6 12-6V9L16 3Z" stroke="currentColor" strokeWidth="2.4" />
              <path d="M16 16v13" stroke="currentColor" strokeWidth="2.4" />
              <path d="M4 9l12 7 12-7" stroke="currentColor" strokeWidth="2.4" />
            </svg>
          </div>
          <h1 className="text-[32px] font-semibold tracking-[-0.04em] text-white">Gatify</h1>
        </div>

        <p className="mt-5 text-[18px] text-white/80">Join thousands of cross-border shoppers</p>

        <div className="mt-8 rounded-[26px] bg-white px-8 py-8 text-left shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <div className="space-y-5">
            <label className="block">
              <span className="text-[14px] font-semibold text-slate-700">Full Name</span>
              <div className="mt-2 flex h-[52px] items-center gap-3 rounded-[16px] border border-slate-200 bg-[#fafbfd] px-4 text-slate-400 focus-within:border-[#18a4f2]">
                <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19.128a9 9 0 0 0 0-14.256M9 4.872a9 9 0 0 0 0 14.256M12 3a9 9 0 0 1 0 18a9 9 0 0 1 0-18Zm0 0c2.5 0 4.5 4.03 4.5 9s-2 9-4.5 9s-4.5-4.03-4.5-9S9.5 3 12 3Z" />
                </svg>
                <input
                  aria-label="Full name"
                  className="w-full bg-transparent text-[16px] text-slate-700 outline-none placeholder:text-slate-400"
                  placeholder="John Doe"
                  type="text"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[14px] font-semibold text-slate-700">Email Address</span>
              <div className="mt-2 flex h-[52px] items-center gap-3 rounded-[16px] border border-slate-200 bg-[#fafbfd] px-4 text-slate-400 focus-within:border-[#18a4f2]">
                <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8.25v7.5A2.25 2.25 0 0 0 5.25 18h13.5A2.25 2.25 0 0 0 21 15.75v-7.5M3 8.25A2.25 2.25 0 0 1 5.25 6h13.5A2.25 2.25 0 0 1 21 8.25M3 8.25l7.59 5.06a2.25 2.25 0 0 0 2.82 0L21 8.25" />
                </svg>
                <input
                  aria-label="Email address"
                  className="w-full bg-transparent text-[16px] text-slate-700 outline-none placeholder:text-slate-400"
                  placeholder="you@example.com"
                  type="email"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-[14px] font-semibold text-slate-700">Password</span>
              <div className="mt-2 flex h-[52px] items-center gap-3 rounded-[16px] border border-slate-200 bg-[#fafbfd] px-4 text-slate-400 focus-within:border-[#18a4f2]">
                <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 10.5V7.5a4.5 4.5 0 1 0-9 0v3m9 0h1.125A2.25 2.25 0 0 1 19.875 12.75v5.25A2.25 2.25 0 0 1 17.625 20.25H6.375A2.25 2.25 0 0 1 4.125 18v-5.25A2.25 2.25 0 0 1 6.375 10.5H7.5m9 0h-9" />
                </svg>
                <input
                  aria-label="Password"
                  className="w-full bg-transparent text-[16px] text-slate-700 outline-none placeholder:text-slate-400"
                  placeholder="Create a strong password"
                  type="password"
                />
              </div>
            </label>

            <label className="block">
              <span className="flex items-center gap-2 text-[14px] font-semibold text-slate-700">
                Citizen ID / Tax Number
                <span className="text-[#18a4f2]">🛡️</span>
              </span>
              <div className="mt-2 flex h-[52px] items-center gap-3 rounded-[16px] border border-slate-200 bg-[#fafbfd] px-4 text-slate-400 focus-within:border-[#18a4f2]">
                <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 6.75A2.25 2.25 0 0 1 6.75 4.5h10.5a2.25 2.25 0 0 1 2.25 2.25v12a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18.75v-12Z" />
                </svg>
                <input
                  aria-label="Citizen ID or tax number"
                  className="w-full bg-transparent text-[16px] text-slate-700 outline-none placeholder:text-slate-400"
                  placeholder="For customs pre-verification"
                  type="text"
                />
              </div>
              <p className="mt-2 text-[12px] leading-5 text-slate-500">Required for automated customs declarations and faster clearance</p>
            </label>

            <div className="rounded-[18px] border border-[#c5dcff] bg-[#eef5ff] px-5 py-4 text-[14px] leading-6 text-[#1646d3]">
              🛡️ Your ID is encrypted and used only for customs verification. This speeds up clearance by 60%.
            </div>

            <button className="flex h-[50px] w-full items-center justify-center gap-3 rounded-[16px] bg-[#18a4f2] text-[18px] font-semibold text-white shadow-[0_12px_28px_rgba(24,164,242,0.24)] transition hover:bg-[#1196e0]" type="button">
              Create Account
              <span aria-hidden="true">→</span>
            </button>

            <p className="pt-1 text-center text-[15px] text-slate-500">
              Already have an account?{' '}
              <button className="text-[#18a4f2] transition hover:text-[#0f7acc]" type="button" onClick={() => onNavigate('/signin')}>
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
