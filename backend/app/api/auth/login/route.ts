import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from "bcrypt"
import { z } from 'zod'
import { signJwt } from '@/utils/jwt'

export const runtime = 'nodejs'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  await connectToDB()
  const body = await req.json()
  const parse = schema.safeParse(body)

  if (!parse.success) {
    return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 })
  }

  const { email, password } = parse.data
  const user = await User.findOne({ email })

  if (!user) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 })
  }

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 })
  }

  const token = signJwt({ userId: user._id.toString(), email: user.email })

  const res = NextResponse.json({ message: 'ok' }, { status: 200 })
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })

  return res
}