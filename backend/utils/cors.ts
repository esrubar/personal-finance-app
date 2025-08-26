import { NextRequest, NextResponse } from 'next/server'

export function withCORS(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get('origin')
  const allowedOrigin = process.env.ALLOWED_ORIGIN

  if (origin && allowedOrigin && origin === allowedOrigin) {
    res.headers.set('Access-Control-Allow-Origin', origin)
    res.headers.set('Vary', 'Origin')
    res.headers.set('Access-Control-Allow-Credentials', 'true')
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  }
  return res
}

export function preflight(req: NextRequest) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN
  const origin = req.headers.get('origin')
  const headers = new Headers()
  if (origin && allowedOrigin && origin === allowedOrigin) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Vary', 'Origin')
    headers.set('Access-Control-Allow-Credentials', 'true')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  }
  return new Response(null, { status: 200, headers })
}