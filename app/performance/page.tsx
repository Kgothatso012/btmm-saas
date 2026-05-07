'use client'

import { useState } from 'react'
import Link from 'next/link'

type NavItem = 'dashboard' | 'scanner' | 'journal' | 'performance' | 'settings'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const EQUITY_CURVE = [
  10000, 10200, 10450, 10380, 10720, 10950, 11200, 11050, 11400, 11750,
  11600, 12000, 12350, 12200, 12600, 12900, 13200, 13050, 13400, 13800,
]

const MONTHLY_PNL = [340.50, 820.00, -180.50, 1250.00, 560.00, 920.00]


const PAIR_STATS = [
  { pair: 'EURJPYm', pnl: 920.50, trades: 12, winRate: 83, avgPips: 68 },
  { pair: 'XAUUSD', pnl: 780.00, trades: 8, winRate: 75, avgPips: 112 },
  { pair: 'USDJPYm', pnl: 612.30, trades: 15, winRate: 73, avgPips: 42 },
  { pair: 'GBPJPYm', pnl: 445.00, trades: 10, winRate: 70, avgPips: 55 },
  { pair: 'EURUSDm', pnl: 380.80, trades: 14, winRate: 71, avgPips: 28 },
  { pair: 'USDCHFm', pnl: -95.40, trades: 7, winRate: 57, avgPips: -12 },
  { pair: 'AUDUSDm', pnl: -120.00, trades: 9, winRate: 56, avgPips: -18 },
]

export default function PerformancePage() {
  const [activeNav] = useState<NavItem>('performance')
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('3M')

  const currentEquity = EQUITY_CURVE[EQUITY_CURVE.length - 1]
  const startEquity = EQUITY_CURVE[0]
  const totalReturn = ((currentEquity - startEquity) / startEquity * 100).toFixed(1)
  const maxEquity = Math.max(...EQUITY_CURVE)
  const minEquity = Math.min(...EQUITY_CURVE)
  const currentDrawdown = ((maxEquity - currentEquity) / maxEquity * 100).toFixed(1)

  return (
    <div className="flex h-screen bg-bg-deep overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 bg-bg-surface border-r border-border flex flex-col items-center py-4 gap-2">
        <div className="w-10 h-10 rounded-lg bg-accent-cyan flex items-center justify-center mb-4 flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="6" r="4" fill="#0A0A0F"/>
            <path d="M8 10 L8 16" stroke="#0A0A0F" strokeWidth="2"/>
            <circle cx="8" cy="6" r="2" fill="#F59E0B"/>
          </svg>
        </div>
        {[
          { id: 'dashboard', icon: '▦', href: '/dashboard' },
          { id: 'scanner', icon: '◎', href: '/scanner' },
          { id: 'journal', icon: '☰', href: '/journal' },
          { id: 'performance', icon: '◔', href: '/performance' },
          { id: 'settings', icon: '⚙', href: '/settings' },
        ].map(({ id, icon, href }) => (
          <Link
            key={id}
            href={href}
            className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center text-xs transition-all ${
              activeNav === id
                ? 'bg-accent-cyan/10 text-accent-cyan border-l-2 border-accent-cyan'
                : 'text-muted hover:text-white hover:bg-bg-elevated'
            }`}
          >
            <span className="text-base leading-none mb-0.5">{icon}</span>
          </Link>
        ))}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-bg-surface border-b border-border flex items-center px-6 gap-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="font-semibold text-sm">Performance</h1>
            <p className="text-muted text-xs">Equity curve, pair analysis, drawdown</p>
          </div>
          <div className="flex items-center gap-2">
            {(['1M', '3M', '6M', '1Y'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  timeframe === tf
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                    : 'bg-bg-surface text-muted hover:text-white border border-border'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
          {/* Top Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-bg-surface border border-border rounded-lg p-4">
              <div className="text-xs text-muted mb-1">Current Equity</div>
              <div className="font-mono font-bold text-2xl text-bull">R{currentEquity.toLocaleString()}</div>
              <div className="text-xs text-muted mt-1">+{totalReturn}% MTD</div>
            </div>
            <div className="bg-bg-surface border border-border rounded-lg p-4">
              <div className="text-xs text-muted mb-1">Max Drawdown</div>
              <div className="font-mono font-bold text-2xl text-bear">-{currentDrawdown}%</div>
              <div className="text-xs text-muted mt-1">R{(maxEquity - minEquity).toFixed(0)} range</div>
            </div>
            <div className="bg-bg-surface border border-border rounded-lg p-4">
              <div className="text-xs text-muted mb-1">Win Rate</div>
              <div className="font-mono font-bold text-2xl text-accent-cyan">75%</div>
              <div className="text-xs text-muted mt-1">6M average</div>
            </div>
            <div className="bg-bg-surface border border-border rounded-lg p-4">
              <div className="text-xs text-muted mb-1">Profit Factor</div>
              <div className="font-mono font-bold text-2xl text-amber">3.2x</div>
              <div className="text-xs text-muted mt-1">Gross R4.8k / R1.5k loss</div>
            </div>
          </div>

          {/* Equity Curve */}
          <div className="bg-bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Equity Curve</h3>
              <span className="text-xs text-muted font-mono">R{startEquity.toLocaleString()} → R{currentEquity.toLocaleString()}</span>
            </div>
            <div className="relative h-48">
              <svg viewBox={`0 0 ${EQUITY_CURVE.length * 50} 180`} className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00FF88" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#00FF88" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Grid */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="0" y1={i * 45} x2="1000" y2={i * 45} stroke="#2A2A3A" strokeWidth="1"/>
                ))}
                {/* Fill */}
                <path
                  d={`M 0 ${180 - (EQUITY_CURVE[0] - minEquity) / (maxEquity - minEquity) * 180} ${
                    EQUITY_CURVE.map((v, i) => `L ${i * 50} ${180 - (v - minEquity) / (maxEquity - minEquity) * 180}`).join(' ')
                  } L ${(EQUITY_CURVE.length - 1) * 50} 180 L 0 180 Z`}
                  fill="url(#equityGrad)"
                />
                {/* Line */}
                <path
                  d={`M 0 ${180 - (EQUITY_CURVE[0] - minEquity) / (maxEquity - minEquity) * 180} ${
                    EQUITY_CURVE.map((v, i) => `L ${i * 50} ${180 - (v - minEquity) / (maxEquity - minEquity) * 180}`).join(' ')
                  }`}
                  stroke="#00FF88"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Monthly P&L */}
            <div className="bg-bg-surface border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4">Monthly P&L</h3>
              <div className="flex items-end gap-2 h-36">
                {MONTHS.map((m, i) => {
                  const maxPnl = Math.max(...MONTHLY_PNL.map(Math.abs))
                  const barH = (Math.abs(MONTHLY_PNL[i]) / maxPnl) * 120
                  const isWin = MONTHLY_PNL[i] >= 0
                  return (
                    <div key={m} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col items-center" style={{ height: '120px', justifyContent: 'flex-end' }}>
                        <div
                          className={`w-full rounded-sm ${isWin ? 'bg-bull' : 'bg-bear'}`}
                          style={{ height: `${barH}px`, opacity: 0.8 }}
                        />
                      </div>
                      <span className="text-xs text-muted">{m}</span>
                      <span className={`text-xs font-mono ${isWin ? 'text-bull' : 'text-bear'}`}>
                        {isWin ? '+' : ''}R{MONTHLY_PNL[i].toFixed(0)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Win Rate by Pair */}
            <div className="bg-bg-surface border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4">Pair Performance</h3>
              <div className="flex flex-col gap-2">
                {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                {PAIR_STATS.slice(0, 5).map(({ pair, pnl, trades, winRate, avgPips: _avgPips }) => (
                  <div key={pair} className="flex items-center gap-3">
                    <span className="font-mono text-xs w-20">{pair}</span>
                    <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
                      <div className={`h-full ${pnl >= 0 ? 'bg-bull' : 'bg-bear'}`} style={{ width: `${winRate}%` }} />
                    </div>
                    <span className="text-xs text-muted w-8">{winRate}%</span>
                    <span className={`font-mono text-xs w-20 text-right ${pnl >= 0 ? 'text-bull' : 'text-bear'}`}>
                      {pnl >= 0 ? '+' : ''}R{pnl.toFixed(0)}
                    </span>
                    <span className="text-xs text-muted w-12 text-right">{trades}t</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full Pair Table */}
          <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-sm">All Pairs Breakdown</h3>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted border-b border-border">
                  <th className="text-left py-2 px-4 font-medium">Pair</th>
                  <th className="text-right py-2 px-4 font-medium">P&L</th>
                  <th className="text-right py-2 px-4 font-medium">Trades</th>
                  <th className="text-right py-2 px-4 font-medium">Win Rate</th>
                  <th className="text-right py-2 px-4 font-medium">Avg Pips</th>
                  <th className="text-right py-2 px-4 font-medium">Best</th>
                  <th className="text-right py-2 px-4 font-medium">Worst</th>
                </tr>
              </thead>
              <tbody>
                {PAIR_STATS.map(p => (
                  <tr key={p.pair} className="border-b border-border/50 hover:bg-bg-elevated">
                    <td className="py-2.5 px-4 font-mono font-semibold">{p.pair}</td>
                    <td className={`py-2.5 px-4 text-right font-mono font-semibold ${p.pnl >= 0 ? 'text-bull' : 'text-bear'}`}>
                      {p.pnl >= 0 ? '+' : ''}R{p.pnl.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-muted">{p.trades}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-muted">{p.winRate}%</td>
                    <td className={`py-2.5 px-4 text-right font-mono ${p.avgPips >= 0 ? 'text-bull' : 'text-bear'}`}>
                      {p.avgPips >= 0 ? '+' : ''}{p.avgPips} pips
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-bull">R{Math.abs(p.pnl * 0.7).toFixed(0)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-bear">R{Math.abs(p.pnl * 0.3).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}