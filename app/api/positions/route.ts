import { NextRequest, NextResponse } from 'next/server'

const FLASK_BACKEND = process.env.FLASK_BACKEND_URL || 'http://localhost:5003/api'

export async function GET() {
  try {
    const resp = await fetch(`${FLASK_BACKEND}/trades/positions`)
    if (!resp.ok) throw new Error('Bridge error')
    const positions = await resp.json()
    return NextResponse.json(positions)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  const { ticket } = await request.json()
  try {
    const resp = await fetch(`${FLASK_BACKEND}/trades/close/${ticket}`, {
      method: 'POST',
    })
    const data = await resp.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to close position' }, { status: 500 })
  }
}
