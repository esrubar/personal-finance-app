import { cookies } from 'next/headers'
import { verifyJwt } from './jwt'

export function getUserFromCookie() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  const payload = verifyJwt<{ userId: string, email: string }>(token)
  return payload
}