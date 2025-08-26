import { NextRequest, NextResponse } from 'next/server'
import { withCORS, preflight } from '@/utils/cors'

export const runtime = 'nodejs'

export async function OPTIONS(req: NextRequest) {
  return preflight(req)
}

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ message: 'ok' })
  res.cookies.set('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return withCORS(req, res)
}