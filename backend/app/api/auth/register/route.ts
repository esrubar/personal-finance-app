import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { withCORS, preflight } from '@/utils/cors'

export const runtime = 'nodejs'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function OPTIONS(req: NextRequest) {
  return preflight(req)
}

export async function POST(req: NextRequest) {
  await connectToDB()
  const body = await req.json()
  const parse = schema.safeParse(body)
  if (!parse.success) {
    const res = NextResponse.json({ message: 'Datos inválidos' }, { status: 400 })
    return withCORS(req, res)
  }
  const { email, password } = parse.data
  const exists = await User.findOne({ email })
  if (exists) {
    const res = NextResponse.json({ message: 'El email ya existe' }, { status: 409 })
    return withCORS(req, res)
  }
  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ email, password: hashed })
  const res = NextResponse.json({ user: { _id: user._id, email: user.email, createdAt: user.createdAt } }, { status: 201 })
  return withCORS(req, res)
}