import { NextResponse } from 'next/server'

const FLASK_BACKEND = process.env.FLASK_BACKEND_URL || 'http://localhost:5003/api'

export async function GET() {
  try {
    const resp = await fetch(`${FLASK_BACKEND}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!resp.ok) throw new Error('Scanner error')
    const signals = await resp.json()
    return NextResponse.json(signals)
  } catch {
    return NextResponse.json([])
  }
}
