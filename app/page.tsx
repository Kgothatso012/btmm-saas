import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-deep flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-accent-cyan flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="6" r="4" fill="#0A0A0F"/>
              <path d="M8 10 L8 16" stroke="#0A0A0F" strokeWidth="2"/>
              <circle cx="8" cy="6" r="2" fill="#F59E0B"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">BTMM<span className="text-accent-cyan">Pro</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-muted hover:text-white text-sm transition-colors">Dashboard</Link>
          <Link href="/scanner" className="text-muted hover:text-white text-sm transition-colors">Scanner</Link>
          <Link href="/login" className="px-4 py-2 rounded bg-accent-cyan text-bg-deep font-semibold text-sm hover:bg-cyan-300 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="max-w-3xl text-center">
          {/* Route mark graphic */}
          <div className="flex justify-center mb-12">
            <svg width="280" height="180" viewBox="0 0 280 180">
              {/* Subtle grid background */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2A2A3A" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="280" height="180" fill="url(#grid)"/>

              {/* Route path */}
              <path d="M 45 130 C 80 40, 180 40, 200 110" stroke="#F59E0B" strokeWidth="10" fill="none" strokeLinecap="round"/>
              <path d="M 45 130 C 80 40, 180 40, 200 110" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round"/>

              {/* Home pin */}
              <circle cx="45" cy="100" r="22" fill="#2563EB" stroke="white" strokeWidth="3"/>
              <polygon points="45,122 32,107 58,107" fill="#2563EB"/>
              {/* House icon */}
              <polygon points="45,88 35,97 55,97" fill="white"/>
              <rect x="38" y="97" width="14" height="10" fill="white"/>

              {/* Bus pin (largest) */}
              <circle cx="120" cy="50" r="32" fill="#F97316" stroke="white" strokeWidth="3"/>
              <polygon points="120,82 104,62 136,62" fill="#F97316"/>
              {/* Bus icon */}
              <rect x="100" y="40" width="40" height="20" rx="4" fill="white"/>
              <rect x="104" y="44" width="8" height="6" rx="1" fill="#F97316"/>
              <rect x="116" y="44" width="8" height="6" rx="1" fill="#F97316"/>
              <rect x="128" y="44" width="8" height="6" rx="1" fill="#F97316"/>
              <circle cx="108" cy="62" r="4" fill="white"/>
              <circle cx="132" cy="62" r="4" fill="white"/>

              {/* School pin */}
              <circle cx="200" cy="100" r="22" fill="#16A34A" stroke="white" strokeWidth="3"/>
              <polygon points="200,122 187,107 213,107" fill="#16A34A"/>
              {/* School icon */}
              <polygon points="200,82 188,94 212,94" fill="white"/>
              <rect x="192" y="94" width="16" height="12" fill="white"/>
              <rect x="196" y="98" width="8" height="8" fill="#16A34A"/>
            </svg>
          </div>

          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
            Beat The Market.<br />
            <span className="text-accent-cyan">Systematically.</span>
          </h1>
          <p className="text-muted text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            BTMM Pro gives South African traders a proven edge — automated scanning, 
            precise entries, risk-controlled exits. No emotion. No guesswork.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login" className="px-8 py-3.5 rounded bg-amber font-semibold text-bg-deep hover:bg-yellow-500 transition-colors text-sm">
              Start Free Trial
            </Link>
            <Link href="/dashboard" className="px-8 py-3.5 rounded border border-border text-muted hover:text-white hover:border-muted transition-colors text-sm">
              See Live Dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-8 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8">
          {[
            {
              icon: '🎯',
              title: 'Precision Scanning',
              desc: '100-day range + EMA alignment across 14 pairs. Signals when institutions defend levels — not when noise traders jump.'
            },
            {
              icon: '⚡',
              title: 'One-Click Execution',
              desc: 'Signal fires, confirm, done. Your SL and TP are pre-calculated. No hesitation, no second-guessing.'
            },
            {
              icon: '📊',
              title: 'Full Trade Journal',
              desc: 'Every setup documented. Every result tracked. Equity curves, win rates, and Sharpe ratios — all automatic.'
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-bg-surface border border-border rounded-lg p-6">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-6 flex items-center justify-between text-muted text-xs">
        <span>© 2026 BTMM Trader Pro. Built by Makena Automation Studios.</span>
        <div className="flex gap-6">
          <span>Terms</span>
          <span>Privacy</span>
          <span>Contact</span>
        </div>
      </footer>
    </main>
  )
}
