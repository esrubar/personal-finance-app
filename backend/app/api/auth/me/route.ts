import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db'
import User from '@/models/User'
import { getUserFromCookie } from '@/utils/auth'
import { withCORS, preflight } from '@/utils/cors'

export const runtime = 'nodejs'

export async function OPTIONS(req: NextRequest) {
  return preflight(req)
}

export async function GET(req: NextRequest) {
  console.log("holaaa")
  await connectToDB()
  const payload = getUserFromCookie()
  if (!payload) {
    const res = NextResponse.json({ message: 'No autenticado' }, { status: 401 })
    return withCORS(req, res)
  }
  const user = await User.findById(payload.userId)//.lean()
  const res = NextResponse.json({ user: { _id: user._id, email: user.email, createdAt: user.createdAt } }, { status: 200 })
  return withCORS(req, res)
}