'use client'

import { useState } from 'react'
import Link from 'next/link'

type NavItem = 'dashboard' | 'scanner' | 'journal' | 'performance' | 'settings'

export default function SettingsPage() {
  const [activeNav] = useState<NavItem>('settings')
  const [mt5server] = useState('Exness-MT5Trial9')
  const [mt5login] = useState('435754224')
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
            <h1 className="font-semibold text-sm">Settings</h1>
            <p className="text-muted text-xs">MT5, risk rules, notifications, API</p>
          </div>
          {saved && (
            <span className="text-xs text-bull bg-bull/10 px-3 py-1 rounded">✓ Saved</span>
          )}
        </header>

        <div className="flex-1 overflow-auto p-6">
          <form onSubmit={handleSave} className="max-w-2xl flex flex-col gap-6">

            {/* MT5 Connection */}
            <div className="bg-bg-surface border border-border rounded-lg p-5">
              <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-bull pulse-live" />
                MT5 Connection
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1.5">MT5 Server</label>
                  <input
                    type="text"
                    defaultValue={mt5server}
                    className="w-full bg-bg-deep border border-border rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent-cyan"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Account ID</label>
                  <input
                    type="text"
                    defaultValue={mt5login}
                    className="w-full bg-bg-deep border border-border rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent-cyan"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••"
                    className="w-full bg-bg-deep border border-border rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent-cyan"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-bull/20 hover:bg-bull/30 text-bull text-xs font-semibold transition-colors"
                  >
                    Test Connection
                  </button>
                </div>
              </div>
            </div>

            {/* Risk Rules */}
            <div className="bg-bg-surface border border-border rounded-lg p-5">
              <h2 className="font-semibold text-sm mb-4">Risk Rules</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Max Risk per Trade (%)', value: '2', id: 'risk' },
                  { label: 'Max Daily Loss (ZAR)', value: '500', id: 'dailyLoss' },
                  { label: 'Max Open Trades', value: '5', id: 'maxTrades' },
                  { label: 'Default SL (pips)', value: '30', id: 'sl' },
                  { label: 'Default TP (pips)', value: '90', id: 'tp' },
                  { label: 'Min R:R Ratio', value: '2.0', id: 'rrr' },
                ].map(({ label, value, id }) => (
                  <div key={id}>
                    <label className="block text-xs text-muted mb-1.5">{label}</label>
                    <input
                      type="text"
                      defaultValue={value}
                      id={id}
                      className="w-full bg-bg-deep border border-border rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent-cyan"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Pairs */}
            <div className="bg-bg-surface border border-border rounded-lg p-5">
              <h2 className="font-semibold text-sm mb-4">Active Pairs</h2>
              <div className="grid grid-cols-4 gap-2">
                {['USDJPYm', 'EURUSDm', 'GBPJPYm', 'XAUUSD', 'USDCHFm', 'AUDUSDm', 'EURJPYm', 'NZDUSDm', 'USDCADm', 'GBPUSDm', 'EURAUDm', 'GBPAUDm'].map(pair => (
                  <label key={pair} className="flex items-center gap-2 bg-bg-deep border border-border rounded px-3 py-2 cursor-pointer hover:border-accent-cyan/40 transition-colors">
                    <input type="checkbox" defaultChecked className="accent-accent-cyan" />
                    <span className="font-mono text-xs">{pair}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-bg-surface border border-border rounded-lg p-5">
              <h2 className="font-semibold text-sm mb-4">Notifications</h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Trade alerts (entry/exit)', defaultChecked: true },
                  { label: 'Daily summary', defaultChecked: true },
                  { label: 'Drawdown warnings', defaultChecked: true },
                  { label: 'Signal scanner alerts', defaultChecked: false },
                ].map(({ label, defaultChecked }) => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked={defaultChecked} className="accent-accent-cyan w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Flask Backend */}
            <div className="bg-bg-surface border border-border rounded-lg p-5">
              <h2 className="font-semibold text-sm mb-4">Flask Backend</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1.5">Backend URL</label>
                  <input
                    type="text"
                    defaultValue="http://localhost:5003/api"
                    className="w-full bg-bg-deep border border-border rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent-cyan"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Supabase Project</label>
                  <input
                    type="text"
                    defaultValue="zjcribmwgavpzycgpwva"
                    className="w-full bg-bg-deep border border-border rounded px-3 py-2 text-xs font-mono focus:outline-none focus:border-accent-cyan"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="px-4 py-2 rounded border border-bear/40 text-bear text-xs font-semibold hover:bg-bear/10 transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded bg-accent-cyan text-bg-deep font-semibold text-sm hover:bg-cyan-300 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}