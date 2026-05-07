'use client'

import { useState } from 'react'
import Link from 'next/link'

type NavItem = 'dashboard' | 'scanner' | 'journal' | 'performance' | 'settings'

interface Trade {
  id: string
  symbol: string
  direction: 'buy' | 'sell'
  entry: number
  exit: number
  sl: number
  tp: number
  volume: number
  pnl: number
  pnlPips: number
  entryTime: string
  exitTime: string
  duration: string
  setup: string
  rating: number
  screenshots: number
  notes: string
}

const SAMPLE_TRADES: Trade[] = [
  { id: 'T001', symbol: 'USDJPYm', direction: 'sell', entry: 156.82, exit: 155.82, sl: 157.12, tp: 155.82, volume: 0.04, pnl: 388.40, pnlPips: 100, entryTime: '2026-05-06 09:00', exitTime: '2026-05-06 14:30', duration: '5h 30m', setup: '100d range low + EMA20 rejection', rating: 5, screenshots: 3, notes: 'Clean rejection at EMA20. SL was 157.12, hit perfectly.' },
  { id: 'T002', symbol: 'EURUSDm', direction: 'buy', entry: 1.0821, exit: 1.0861, sl: 1.0791, tp: 1.0861, volume: 0.05, pnl: 212.50, pnlPips: 40, entryTime: '2026-05-06 08:15', exitTime: '2026-05-06 11:45', duration: '3h 30m', setup: '100d range high + EMA200 hold', rating: 4, screenshots: 2, notes: 'EMA200 support held. Slightly early exit but solid.' },
  { id: 'T003', symbol: 'GBPJPYm', direction: 'sell', entry: 198.45, exit: 198.05, sl: 198.85, tp: 197.65, volume: 0.04, pnl: 156.80, pnlPips: 40, entryTime: '2026-05-05 14:00', exitTime: '2026-05-05 18:00', duration: '4h 0m', setup: 'EMA20 rejection at 100d range', rating: 3, screenshots: 1, notes: 'Partial TP at TP2. Closed early due to news.' },
  { id: 'T004', symbol: 'XAUUSD', direction: 'buy', entry: 2338.00, exit: 2362.50, sl: 2328.00, tp: 2362.50, volume: 0.02, pnl: 490.00, pnlPips: 245, entryTime: '2026-05-05 10:00', exitTime: '2026-05-06 09:30', duration: '23h 30m', setup: '100d range high breakout', rating: 5, screenshots: 4, notes: 'Golden entry. Bought at EMA20 pullback after range breakout.' },
  { id: 'T005', symbol: 'USDCHFm', direction: 'sell', entry: 0.9012, exit: 0.8990, sl: 0.9042, tp: 0.8962, volume: 0.04, pnl: 88.00, pnlPips: 22, entryTime: '2026-05-04 15:30', exitTime: '2026-05-04 20:00', duration: '4h 30m', setup: '50% fib retrace + EMA20 touch', rating: 3, screenshots: 2, notes: 'Missed full target. Range continuation trade.' },
  { id: 'T006', symbol: 'EURJPYm', direction: 'sell', entry: 169.80, exit: 168.50, sl: 170.10, tp: 168.50, volume: 0.04, pnl: 512.00, pnlPips: 130, entryTime: '2026-05-04 09:00', exitTime: '2026-05-05 08:00', duration: '23h 0m', setup: '100d range low + EMA200 bounce', rating: 5, screenshots: 3, notes: 'Big move down. Held through weekend.' },
  { id: 'T007', symbol: 'AUDUSDm', direction: 'buy', entry: 0.6540, exit: 0.6520, sl: 0.6510, tp: 0.6590, volume: 0.04, pnl: -80.00, pnlPips: -20, entryTime: '2026-05-03 12:00', exitTime: '2026-05-03 16:00', duration: '4h 0m', setup: 'EMA50 support attempt', rating: 2, screenshots: 1, notes: 'Bad read. EMA50 broke. SL hit.' },
  { id: 'T008', symbol: 'NZDUSDm', direction: 'buy', entry: 0.6020, exit: 0.6070, sl: 0.5990, tp: 0.6070, volume: 0.05, pnl: 253.50, pnlPips: 50, entryTime: '2026-05-02 08:00', exitTime: '2026-05-02 15:00', duration: '7h 0m', setup: '100d range high + EMA200 hold', rating: 4, screenshots: 2, notes: 'Clean trade. Hit TP2.' },
]

const STATS = {
  totalTrades: 8,
  winRate: 75,
  totalPnl: 2021.20,
  avgWin: 284.45,
  avgLoss: -80.00,
  profitFactor: 3.2,
  longestWin: 7,
  longestLoss: 1,
  sharpeRatio: 1.84,
  maxDrawdown: -180.50,
  bestTrade: 512.00,
  worstTrade: -80.00,
  bestPair: 'EURJPYm',
  worstPair: 'AUDUSDm',
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-xs ${i <= rating ? 'text-amber' : 'text-border'}`}>★</span>
      ))}
    </div>
  )
}

export default function JournalPage() {
  const [activeNav] = useState<NavItem>('journal')
  const [filter, setFilter] = useState<'all' | 'win' | 'loss'>('all')

  const filtered = SAMPLE_TRADES.filter(t => {
    if (filter === 'win') return t.pnl > 0
    if (filter === 'loss') return t.pnl < 0
    return true
  })

  const wins = SAMPLE_TRADES.filter(t => t.pnl > 0)
  const losses = SAMPLE_TRADES.filter(t => t.pnl < 0)
  const totalPnl = SAMPLE_TRADES.reduce((s, t) => s + t.pnl, 0)

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
            <h1 className="font-semibold text-sm">Trade Journal</h1>
            <p className="text-muted text-xs">Every setup documented. Every result tracked.</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-bull pulse-live" />
              <span className="text-muted">Live P&L</span>
            </div>
            <div className={`font-mono font-semibold ${totalPnl >= 0 ? 'text-bull' : 'text-bear'}`}>
              {totalPnl >= 0 ? '+' : ''}R{totalPnl.toFixed(2)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-6 gap-3">
            {[
              { label: 'Win Rate', value: `${STATS.winRate}%`, color: 'text-bull' },
              { label: 'Profit Factor', value: `${STATS.profitFactor}x`, color: 'text-accent-cyan' },
              { label: 'Best Trade', value: `R${STATS.bestTrade.toFixed(0)}`, color: 'text-bull' },
              { label: 'Worst Trade', value: `R${STATS.worstTrade.toFixed(0)}`, color: 'text-bear' },
              { label: 'Max Drawdown', value: `R${STATS.maxDrawdown.toFixed(0)}`, color: 'text-bear' },
              { label: 'Sharpe Ratio', value: `${STATS.sharpeRatio}`, color: 'text-amber' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-bg-surface border border-border rounded-lg p-3">
                <div className="text-xs text-muted mb-1">{label}</div>
                <div className={`font-mono font-bold text-lg ${color}`}>{value}</div>
              </div>
            ))}
          </div>

          {/* W/L bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-bg-surface rounded-full overflow-hidden flex">
              <div className="bg-bull h-full" style={{ width: `${(wins.length / STATS.totalTrades) * 100}%` }} />
              <div className="bg-bear h-full" style={{ width: `${(losses.length / STATS.totalTrades) * 100}%` }} />
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-bull">{wins.length}W</span>
              <span className="text-bear">{losses.length}L</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {(['all', 'win', 'loss'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded text-xs font-semibold capitalize transition-colors ${
                  filter === f
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                    : 'bg-bg-surface text-muted hover:text-white border border-border'
                }`}
              >
                {f === 'all' ? 'All Trades' : f === 'win' ? 'Winners' : 'Losers'}
              </button>
            ))}
          </div>

          {/* Trade List */}
          <div className="flex flex-col gap-2">
            {filtered.map(trade => (
              <div key={trade.id} className="bg-bg-surface border border-border rounded-lg p-4 hover:border-accent-cyan/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted">{trade.id}</span>
                    <span className={`font-mono font-bold ${trade.direction === 'buy' ? 'text-bull' : 'text-bear'}`}>
                      {trade.direction === 'buy' ? '▲ BUY' : '▼ SELL'}
                    </span>
                    <span className="font-mono font-semibold">{trade.symbol}</span>
                    <Stars rating={trade.rating} />
                    <span className="text-xs text-muted">{trade.setup}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`font-mono font-bold ${trade.pnl >= 0 ? 'text-bull' : 'text-bear'}`}>
                        {trade.pnl >= 0 ? '+' : ''}R{Math.abs(trade.pnl).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted">{trade.pnlPips} pips</div>
                    </div>
                    <button className="text-xs text-accent-cyan hover:underline">View →</button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2 text-xs text-muted">
                  <span>Entry: <span className="font-mono text-white">{trade.entry.toFixed(trade.symbol.includes('JPY') ? 3 : 5)}</span></span>
                  <span>Exit: <span className="font-mono text-white">{trade.exit.toFixed(trade.symbol.includes('JPY') ? 3 : 5)}</span></span>
                  <span>SL: <span className="font-mono text-bear">{trade.sl.toFixed(trade.symbol.includes('JPY') ? 3 : 5)}</span></span>
                  <span>TP: <span className="font-mono text-bull">{trade.tp.toFixed(trade.symbol.includes('JPY') ? 3 : 5)}</span></span>
                  <span>Size: <span className="font-mono text-white">{trade.volume}</span></span>
                  <span>Duration: <span className="font-mono text-white">{trade.duration}</span></span>
                </div>
                {trade.notes && (
                  <div className="mt-2 text-xs text-muted italic border-t border-border/50 pt-2">
                    &quot;{trade.notes}&quot;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}