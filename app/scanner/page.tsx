'use client'

import { useState } from 'react'
import Link from 'next/link'

type NavItem = 'dashboard' | 'scanner' | 'journal' | 'performance' | 'settings'

interface Signal {
  id: string
  symbol: string
  direction: 'buy' | 'sell'
  strength: number
  entry: number
  sl: number
  tp: number
  tp2: number
  age: number
  range: string
  ema20: number
  ema200: number
  score: number
}

// Sample signals matching BTMM methodology
const SAMPLE_SIGNALS: Signal[] = [
  { id: '1', symbol: 'USDJPYm', direction: 'sell', strength: 87, entry: 156.82, sl: 157.12, tp: 155.82, tp2: 155.12, age: 2, range: '100d range low', ema20: 156.95, ema200: 156.20, score: 78 },
  { id: '2', symbol: 'EURUSDm', direction: 'buy', strength: 82, entry: 1.0821, sl: 1.0791, tp: 1.0861, tp2: 1.0891, age: 5, range: '100d range high', ema20: 1.0815, ema200: 1.0750, score: 85 },
  { id: '3', symbol: 'GBPJPYm', direction: 'sell', strength: 79, entry: 198.45, sl: 198.85, tp: 197.65, tp2: 197.15, age: 1, range: 'EMA20 rejected', ema20: 198.60, ema200: 197.90, score: 72 },
  { id: '4', symbol: 'XAUUSD', direction: 'buy', strength: 91, entry: 2342.50, sl: 2332.50, tp: 2362.50, tp2: 2375.00, age: 0, range: '100d range high', ema20: 2338.00, ema200: 2305.00, score: 92 },
  { id: '5', symbol: 'USDCHFm', direction: 'sell', strength: 74, entry: 0.9012, sl: 0.9042, tp: 0.8962, tp2: 0.8932, age: 3, range: '50% retrace', ema20: 0.9018, ema200: 0.8980, score: 68 },
  { id: '6', symbol: 'AUDUSDm', direction: 'buy', strength: 76, entry: 0.6540, sl: 0.6510, tp: 0.6590, tp2: 0.6620, age: 4, range: 'EMA20 hold', ema20: 0.6535, ema200: 0.6480, score: 71 },
  { id: '7', symbol: 'EURJPYm', direction: 'sell', strength: 83, entry: 169.80, sl: 170.10, tp: 169.00, tp2: 168.50, age: 1, range: '100d range low', ema20: 169.95, ema200: 169.10, score: 80 },
  { id: '8', symbol: 'NZDUSDm', direction: 'buy', strength: 69, entry: 0.6020, sl: 0.5990, tp: 0.6070, tp2: 0.6100, age: 6, range: 'EMA50 bounce', ema20: 0.6015, ema200: 0.5970, score: 65 },
]

const PAIRS = ['All', 'USDJPYm', 'EURUSDm', 'GBPJPYm', 'XAUUSD', 'USDCHFm', 'AUDUSDm', 'EURJPYm', 'NZDUSDm', 'USDCADm', 'GBPUSDm']

function SignalCard({ signal, onExecute }: { signal: Signal; onExecute: (s: Signal) => void }) {
  const isBuy = signal.direction === 'buy'
  const dirColor = isBuy ? 'text-bull' : 'text-bear'
  const dirBg = isBuy ? 'bg-bull/10 border-bull/30' : 'bg-bear/10 border-bear/30'
  const pipsToTp = signal.direction === 'buy'
    ? ((signal.tp - signal.entry) * (signal.symbol.includes('JPY') ? 100 : 10000)).toFixed(1)
    : ((signal.entry - signal.tp) * (signal.symbol.includes('JPY') ? 100 : 10000)).toFixed(1)

  const pipsToSl = signal.direction === 'buy'
    ? ((signal.entry - signal.sl) * (signal.symbol.includes('JPY') ? 100 : 10000)).toFixed(1)
    : ((signal.sl - signal.entry) * (signal.symbol.includes('JPY') ? 100 : 10000)).toFixed(1)

  return (
    <div className={`rounded-lg border p-4 flex flex-col gap-3 ${dirBg} hover:border-border transition-colors`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`font-mono font-bold text-sm ${dirColor}`}>
            {isBuy ? '▲ BUY' : '▼ SELL'}
          </span>
          <span className="font-mono font-bold">{signal.symbol}</span>
          <span className="text-xs text-muted bg-bg-elevated px-2 py-0.5 rounded">{signal.age}h ago</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-16 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-amber rounded-full"
              style={{ width: `${signal.score}%` }}
            />
          </div>
          <span className="text-xs text-amber font-mono ml-1">{signal.score}</span>
        </div>
      </div>

      {/* Price levels */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-bg-deep rounded px-2 py-1.5">
          <span className="text-muted">Entry</span>
          <div className="font-mono font-semibold">{signal.entry.toFixed(signal.symbol.includes('JPY') ? 3 : 5)}</div>
        </div>
        <div className="bg-bg-deep rounded px-2 py-1.5">
          <span className="text-muted">Range</span>
          <div className="font-mono text-accent-cyan text-xs">{signal.range}</div>
        </div>
        <div className="bg-bg-deep rounded px-2 py-1.5 border border-bear/30">
          <span className="text-muted">SL ({pipsToSl} pips)</span>
          <div className="font-mono font-semibold text-bear">{signal.sl.toFixed(signal.symbol.includes('JPY') ? 3 : 5)}</div>
        </div>
        <div className="bg-bg-deep rounded px-2 py-1.5 border border-bull/30">
          <span className="text-muted">TP ({pipsToTp} pips)</span>
          <div className="font-mono font-semibold text-bull">{signal.tp.toFixed(signal.symbol.includes('JPY') ? 3 : 5)}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-muted">
        <span>EMA20: <span className="font-mono text-white">{signal.ema20.toFixed(signal.symbol.includes('JPY') ? 3 : 5)}</span></span>
        <span>EMA200: <span className="font-mono text-white">{signal.ema200.toFixed(signal.symbol.includes('JPY') ? 3 : 5)}</span></span>
        <span className="ml-auto text-amber">Strength {signal.strength}%</span>
      </div>

      {/* Execute */}
      <button
        onClick={() => onExecute(signal)}
        className={`w-full py-2 rounded text-xs font-semibold transition-colors ${
          isBuy
            ? 'bg-bull/20 hover:bg-bull/30 text-bull'
            : 'bg-bear/20 hover:bg-bear/30 text-bear'
        }`}
      >
        Execute {signal.direction.toUpperCase()} on {signal.symbol}
      </button>
    </div>
  )
}

export default function ScannerPage() {
  const [activeNav] = useState<NavItem>('scanner')
  const [selectedPair, setSelectedPair] = useState('All')
  const [signals] = useState<Signal[]>(SAMPLE_SIGNALS)
  const [direction, setDirection] = useState<'all' | 'buy' | 'sell'>('all')

  const filtered = signals.filter(s => {
    if (selectedPair !== 'All' && s.symbol !== selectedPair) return false
    if (direction !== 'all' && s.direction !== direction) return false
    return true
  })

  const buySignals = signals.filter(s => s.direction === 'buy').length
  const sellSignals = signals.filter(s => s.direction === 'sell').length

  const [, setSelectedSignal] = useState<Signal | null>(null)

  function handleExecute(signal: Signal) {
    setSelectedSignal(signal)
    window.location.href = '/dashboard'
  }

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
          { id: 'dashboard', icon: '▦' },
          { id: 'scanner', icon: '◎' },
          { id: 'journal', icon: '☰' },
          { id: 'performance', icon: '◔' },
          { id: 'settings', icon: '⚙' },
        ].map(({ id, icon }) => (
          <Link
            key={id}
            href={`/${id === 'dashboard' ? 'dashboard' : id}`}
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
            <h1 className="font-semibold text-sm">Scanner</h1>
            <p className="text-muted text-xs">BTMM Signals — 14 pairs, M15/H1</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-bull">▲ {buySignals} buy</span>
              <span className="text-bear">▼ {sellSignals} sell</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-bull pulse-live" />
              <span className="text-xs text-muted">Live</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {['All', 'Buy', 'Sell'].map(d => (
              <button
                key={d}
                onClick={() => setDirection(d.toLowerCase() as 'all' | 'buy' | 'sell')}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  direction === d.toLowerCase()
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                    : 'bg-bg-surface text-muted hover:text-white border border-border'
                }`}
              >
                {d}
              </button>
            ))}
            <div className="h-4 w-px bg-border mx-2" />
            {PAIRS.map(pair => (
              <button
                key={pair}
                onClick={() => setSelectedPair(pair)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                  selectedPair === pair
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                    : 'bg-bg-surface text-muted hover:text-white border border-border'
                }`}
              >
                {pair}
              </button>
            ))}
          </div>

          {/* Signal count */}
          <div className="text-xs text-muted">
            Showing {filtered.length} signals — BTMM criteria: 100d range ± EMA alignment
          </div>

          {/* Signals grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(signal => (
              <SignalCard key={signal.id} signal={signal} onExecute={handleExecute} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-2 flex items-center justify-center h-48 text-muted text-sm">
                No signals match your filters
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}