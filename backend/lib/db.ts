import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI no está definido')
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: { conn: typeof mongoose | null, promise: Promise<typeof mongoose> | null }
}

let cached = global._mongooseConn
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null }
}

export async function connectToDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m)
  }
  cached.conn = await cached.promise
  return cached.conn
}