'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Position {
  ticket: number
  symbol: string
  type: 'buy' | 'sell'
  volume: number
  price: number
  sl: number
  tp: number
  profit: number
}

type NavItem = 'dashboard' | 'scanner' | 'journal' | 'performance' | 'settings'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatPrice(price: number, symbol: string) {
  if (symbol.includes('JPY')) return price.toFixed(3)
  if (symbol.includes('XAU')) return price.toFixed(2)
  return price.toFixed(5)
}

function formatProfit(profit: number) {
  const sign = profit >= 0 ? '+' : ''
  return `${sign}R${Math.abs(profit).toFixed(2)}`
}

function formatVolume(vol: number) {
  return vol.toFixed(2)
}

// ─── Chart Component ─────────────────────────────────────────────────────────
function Chart({ symbol }: { symbol: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#12121A' },
        textColor: '#8A8A9A',
      },
      grid: {
        vertLines: { color: '#1A1A25' },
        horzLines: { color: '#1A1A25' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#2A2A3A', labelBackgroundColor: '#2A2A3A' },
        horzLine: { color: '#2A2A3A', labelBackgroundColor: '#2A2A3A' },
      },
      rightPriceScale: {
        borderColor: '#2A2A3A',
      },
      timeScale: {
        borderColor: '#2A2A3A',
        timeVisible: true,
      },
    })

    const candles = chart.addCandlestickSeries({
      upColor: '#00FF88',
      downColor: '#FF3366',
      borderUpColor: '#00FF88',
      borderDownColor: '#FF3366',
      wickUpColor: '#00FF88',
      wickDownColor: '#FF3366',
    })

    chartRef.current = chart
    candleRef.current = candles

    // Load sample data for demo
    loadData(symbol, candles, chart)

    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth })
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [symbol])

  return <div ref={containerRef} className="w-full" />
}

async function loadData(symbol: string, candles: ISeriesApi<'Candlestick'>, chart: IChartApi) {
  // Fetch M15 candles from Flask backend
  try {
    const resp = await fetch(`http://localhost:5003/api/analyze?symbol=${symbol}&timeframe=M15`)
    if (resp.ok) {
      const data = await resp.json()
      if (data.candles && Array.isArray(data.candles)) {
        const formatted = data.candles.map((c: number[]) => ({
          time: (c[0] / 1000) as CandlestickData['time'],
          open: c[1],
          high: c[2],
          low: c[3],
          close: c[4],
        }))
        candles.setData(formatted)
        chart.timeScale().fitContent()
        return
      }
    }
  } catch { /* backend may not have this data */ }

  // Fallback: sample data so the chart still renders
  const now = Math.floor(Date.now() / 1000)
  const interval = 900 // M15 = 900s
  const sampleData: CandlestickData[] = []
  let price = symbol.includes('JPY') ? 156.5 : symbol.includes('XAU') ? 2340 : 1.0850

  for (let i = 100; i >= 0; i--) {
    const t = now - i * interval
    const open = price
    const change = (Math.random() - 0.49) * 0.003 * price
    const close = price + change
    const high = Math.max(open, close) + Math.random() * 0.001 * price
    const low = Math.min(open, close) - Math.random() * 0.001 * price
    sampleData.push({ time: t as CandlestickData['time'], open, high, low, close })
    price = close
  }

  candles.setData(sampleData)
  chart.timeScale().fitContent()
}

// ─── Positions Table ───────────────────────────────────────────────────────────
function PositionsTable({ positions, onClose }: { positions: Position[]; onClose: (t: number) => void }) {
  if (!positions.length) {
    return (
      <div className="flex items-center justify-center h-32 text-muted text-sm">
        No open positions
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-muted border-b border-border">
            <th className="text-left py-2 px-3 font-medium">Symbol</th>
            <th className="text-left py-2 px-3 font-medium">Dir</th>
            <th className="text-right py-2 px-3 font-medium">Size</th>
            <th className="text-right py-2 px-3 font-medium">Entry</th>
            <th className="text-right py-2 px-3 font-medium">P&L</th>
            <th className="text-right py-2 px-3 font-medium">SL</th>
            <th className="text-right py-2 px-3 font-medium">TP</th>
            <th className="py-2 px-3 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {positions.map(pos => (
            <tr
              key={pos.ticket}
              className="border-b border-border/50 hover:bg-bg-elevated transition-colors"
            >
              <td className="py-2.5 px-3 font-mono font-semibold">{pos.symbol}</td>
              <td className="py-2.5 px-3">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${pos.type === 'buy' ? 'text-bull' : 'text-bear'}`}>
                  {pos.type === 'buy' ? '▲' : '▼'} {pos.type.toUpperCase()}
                </span>
              </td>
              <td className="py-2.5 px-3 text-right font-mono">{formatVolume(pos.volume)}</td>
              <td className="py-2.5 px-3 text-right font-mono">{formatPrice(pos.price, pos.symbol)}</td>
              <td className={`py-2.5 px-3 text-right font-mono font-semibold ${pos.profit >= 0 ? 'text-bull' : 'text-bear'}`}>
                {formatProfit(pos.profit)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-muted">{formatPrice(pos.sl, pos.symbol)}</td>
              <td className="py-2.5 px-3 text-right font-mono text-muted">{formatPrice(pos.tp, pos.symbol)}</td>
              <td className="py-2.5 px-3">
                <button
                  onClick={() => onClose(pos.ticket)}
                  className="w-6 h-6 rounded bg-bear/20 hover:bg-bear/40 text-bear flex items-center justify-center text-xs transition-colors"
                  title="Close position"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard')
  const [selectedSymbol, setSelectedSymbol] = useState('USDJPYm')
  const [positions, setPositions] = useState<Position[]>([])
  const [balance, setBalance] = useState(0)
  const [equity, setEquity] = useState(0)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch positions from Flask backend
  async function fetchPositions() {
    try {
      const resp = await fetch('/api/positions')
      if (resp.ok) {
        const data = await resp.json()
        setPositions(data)
      }
    } catch { /* ignore */ }
  }

  // Fetch account info
  async function fetchAccount() {
    try {
      const resp = await fetch('http://localhost:5003/api/mt5/account')
      if (resp.ok) {
        const acc = await resp.json()
        setBalance(acc.balance || 0)
        setEquity(acc.equity || 0)
        setConnected(acc.login !== undefined)
      }
    } catch { /* ignore */ }
  }

  useEffect(() => {
    async function init() {
      setLoading(true)
      await Promise.all([fetchPositions(), fetchAccount()])
      setLoading(false)
    }
    init()

    const interval = setInterval(() => {
      fetchPositions()
      fetchAccount()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  async function handleClosePosition(ticket: number) {
    const res = await fetch('/api/positions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket }),
    })
    if (res.ok) {
      setPositions(prev => prev.filter(p => p.ticket !== ticket))
      fetchAccount()
    }
  }

  const totalPnl = positions.reduce((sum, p) => sum + p.profit, 0)

  return (
    <div className="flex h-screen bg-bg-deep overflow-hidden">

      {/* ── Left Sidebar ── */}
      <aside className="w-16 bg-bg-surface border-r border-border flex flex-col items-center py-4 gap-2">
        {/* Logo */}
        <div className="w-10 h-10 rounded-lg bg-accent-cyan flex items-center justify-center mb-4 flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="6" r="4" fill="#0A0A0F"/>
            <path d="M8 10 L8 16" stroke="#0A0A0F" strokeWidth="2"/>
            <circle cx="8" cy="6" r="2" fill="#F59E0B"/>
          </svg>
        </div>

        {/* Nav items */}
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '▦' },
          { id: 'scanner', label: 'Scanner', icon: '◎' },
          { id: 'journal', label: 'Journal', icon: '☰' },
          { id: 'performance', label: 'Stats', icon: '◔' },
          { id: 'settings', label: 'Settings', icon: '⚙' },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveNav(id as NavItem)}
            title={label}
            className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center text-xs transition-all
              ${activeNav === id
                ? 'bg-accent-cyan/10 text-accent-cyan border-l-2 border-accent-cyan'
                : 'text-muted hover:text-white hover:bg-bg-elevated'
              }`}
          >
            <span className="text-base leading-none mb-0.5">{icon}</span>
          </button>
        ))}

        {/* Bottom: account indicator + logout */}
        <div className="mt-auto flex flex-col items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-bull pulse-live' : 'bg-bear'}`} title={connected ? 'MT5 Connected' : 'MT5 Disconnected'} />
          <Link href="/api/auth/logout" className="text-muted hover:text-white text-xs mt-2" title="Logout">
            ↩
          </Link>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <header className="h-16 bg-bg-surface border-b border-border flex items-center px-6 gap-4 flex-shrink-0">
          {/* Page title */}
          <div className="flex-1">
            <h1 className="font-semibold text-sm">Dashboard</h1>
            <p className="text-muted text-xs">BTMM Trading Workspace</p>
          </div>

          {/* Symbol search */}
          <div className="relative">
            <input
              type="text"
              value={selectedSymbol}
              onChange={e => setSelectedSymbol(e.target.value.toUpperCase())}
              placeholder="Symbol..."
              className="bg-bg-deep border border-border rounded px-3 py-1.5 text-xs font-mono w-36 focus:outline-none focus:border-accent-cyan transition-colors"
            />
          </div>

          {/* Connection status */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-bull pulse-live' : 'bg-bear'}`} />
            <span className="text-muted">{connected ? 'MT5 Live' : 'MT5 Offline'}</span>
          </div>

          {/* Balance */}
          <div className="text-right">
            <div className="text-xs text-muted">Balance</div>
            <div className="text-sm font-mono font-semibold">R{balance.toFixed(2)}</div>
          </div>

          {/* Equity */}
          <div className="text-right">
            <div className="text-xs text-muted">Equity</div>
            <div className={`text-sm font-mono font-semibold ${equity >= balance ? 'text-bull' : 'text-bear'}`}>
              R{equity.toFixed(2)}
            </div>
          </div>

          {/* Total P&L */}
          <div className="text-right pl-4 border-l border-border">
            <div className="text-xs text-muted">Open P&L</div>
            <div className={`text-sm font-mono font-semibold ${totalPnl >= 0 ? 'text-bull' : 'text-bear'}`}>
              {totalPnl >= 0 ? '+' : ''}R{Math.abs(totalPnl).toFixed(2)}
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">

          {loading ? (
            <div className="flex items-center justify-center h-64 text-muted text-sm">
              Loading workspace...
            </div>
          ) : (
            <>
              {/* Chart */}
              <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm">{selectedSymbol}</span>
                    <div className="flex gap-1">
                      {['M15', 'H1', 'H4', 'D1'].map(tf => (
                        <button
                          key={tf}
                          className="px-2 py-1 text-xs rounded bg-bg-elevated text-muted hover:text-white transition-colors"
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-muted">
                    BTMM Chart — {selectedSymbol}
                  </div>
                </div>
                <Chart symbol={selectedSymbol} />
              </div>

              {/* Positions */}
              <div className="bg-bg-surface border border-border rounded-lg overflow-hidden flex-shrink-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-sm">Open Positions</h2>
                    <span className="text-xs text-muted bg-bg-elevated px-2 py-0.5 rounded">
                      {positions.length} active
                    </span>
                  </div>
                  <button
                    onClick={fetchPositions}
                    className="text-xs text-muted hover:text-white transition-colors"
                  >
                    ↻ Refresh
                  </button>
                </div>
                <PositionsTable positions={positions} onClose={handleClosePosition} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <aside className="w-72 bg-bg-surface border-l border-border flex flex-col flex-shrink-0">

        {/* Quick Trade */}
        <div className="p-4 border-b border-border">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Quick Trade</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Symbol"
              defaultValue={selectedSymbol}
              className="flex-1 bg-bg-deep border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-accent-cyan"
            />
            <input
              type="number"
              placeholder="Lot"
              defaultValue="0.04"
              className="w-20 bg-bg-deep border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-accent-cyan"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input
              type="number"
              placeholder="SL pips"
              defaultValue="30"
              className="bg-bg-deep border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-accent-cyan"
            />
            <input
              type="number"
              placeholder="TP pips"
              defaultValue="90"
              className="bg-bg-deep border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-accent-cyan"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="py-2 rounded bg-bull/20 hover:bg-bull/30 text-bull text-xs font-semibold transition-colors">
              ▲ BUY
            </button>
            <button className="py-2 rounded bg-bear/20 hover:bg-bear/30 text-bear text-xs font-semibold transition-colors">
              ▼ SELL
            </button>
          </div>
        </div>

        {/* Scanner Quick View */}
        <div className="p-4 border-b border-border flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Scanner</h3>
            <Link href="/scanner" className="text-xs text-accent-cyan hover:underline">View all →</Link>
          </div>
          <div className="text-xs text-muted text-center py-8">
            Open scanner to see live signals
          </div>
        </div>

        {/* Account Info */}
        <div className="p-4 border-t border-border">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Account</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">Demo Account</span>
              <span className="font-mono">435754224</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Server</span>
              <span className="font-mono text-muted">Exness-MT5Trial9</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Margin used</span>
              <span className="font-mono text-muted">—</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
