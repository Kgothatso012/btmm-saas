import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  const cookieStore = await cookies()
  cookieStore.delete('sb-access-token')
  cookieStore.delete('sb-refresh-token')
  cookieStore.delete('sb-user-id')
  return response
}
