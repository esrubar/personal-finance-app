import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido')
}

export function signJwt(
    payload: object,
    expiresIn: SignOptions["expiresIn"] = "7d"
) {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
}

export function verifyJwt<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T
  } catch {
    return null
  }
}