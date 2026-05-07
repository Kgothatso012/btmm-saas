'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Network error. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded bg-accent-cyan flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="6" r="4" fill="#0A0A0F"/>
              <path d="M8 10 L8 16" stroke="#0A0A0F" strokeWidth="2"/>
              <circle cx="8" cy="6" r="2" fill="#F59E0B"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">BTMM<span className="text-accent-cyan">Pro</span></span>
        </div>

        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <h1 className="text-xl font-bold mb-1">Welcome back</h1>
          <p className="text-muted text-sm mb-6">Sign in to your trading account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-muted mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-bg-deep border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-accent-cyan transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-muted mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-bg-deep border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-accent-cyan transition-colors"
              />
            </div>

            {error && (
              <div className="bg-bear/10 border border-bear/30 text-bear text-xs px-3 py-2 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-cyan text-bg-deep font-semibold py-2.5 rounded hover:bg-cyan-300 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-muted text-xs mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-accent-cyan hover:underline">Start free trial</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
