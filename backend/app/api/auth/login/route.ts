import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/db'
import User from '@/models/User'
import bcrypt from "bcrypt"
import { z } from 'zod'
import { signJwt } from '@/utils/jwt'
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
  console.log("hola")
  await connectToDB()
  const body = await req.json()
  const parse = schema.safeParse(body)
  console.log("hola")
  if (!parse.success) {
    const res = NextResponse.json({ message: 'Datos inválidos' }, { status: 400 })
    return withCORS(req, res)
  }
  const { email, password } = parse.data
  console.log(email, password)

  const query = User.findOne({ email });
  console.log(await query.explain());
  
  const user = await User.findOne({ email })
  console.log(user)
  
  if (!user) {
    const res = NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 })
    return withCORS(req, res)
  }
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    const res = NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 })
    return withCORS(req, res)
  }
  const token = signJwt({ userId: user._id.toString(), email: user.email })
  const res = NextResponse.json({ message: 'ok' }, { status: 200 })
  res.cookies.set('token', token, {
    httpOnly: true, // preserve type for TS emit
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })
  return withCORS(req, res)
}