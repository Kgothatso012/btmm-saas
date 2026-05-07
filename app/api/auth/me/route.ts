import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value
  const userId = cookieStore.get('sb-user-id')?.value

  if (!accessToken || !userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const resp = await fetch(
    `${supabaseUrl}/auth/v1/user`,
    {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  )

  if (!resp.ok) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  return NextResponse.json({ userId, ok: true })
}
