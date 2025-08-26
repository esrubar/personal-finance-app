import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db'
import Expense from '@/models/Expense'
import { getUserFromCookie } from '@/utils/auth'
import { withCORS, preflight } from '@/utils/cors'

export const runtime = 'nodejs'

export async function OPTIONS(req: NextRequest) {
  return preflight(req)
}

export async function GET(req: NextRequest) {
  await connectToDB()
  const payload = getUserFromCookie()
  if (!payload) {
    const res = NextResponse.json({ message: 'No autenticado' }, { status: 401 })
    return withCORS(req, res)
  }
  const list = await Expense.find({ userId: payload.userId }).sort({ createdAt: -1 }).lean()
  const res = NextResponse.json({ data: list }, { status: 200 })
  return withCORS(req, res)
}

export async function POST(req: NextRequest) {
  await connectToDB()
  const payload = getUserFromCookie()
  if (!payload) {
    const res = NextResponse.json({ message: 'No autenticado' }, { status: 401 })
    return withCORS(req, res)
  }
  const body = await req.json()
  const created = await Expense.create({ userId: payload.userId, title: body.title, amount: Number(body.amount) })
  const res = NextResponse.json({ data: created }, { status: 201 })
  return withCORS(req, res)
}