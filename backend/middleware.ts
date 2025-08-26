// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const origin = req.headers.get("origin") || "";

    // Solo interceptar OPTIONS
    if (req.method === "OPTIONS") {
        const headers = new Headers();
        if (origin.startsWith("http://localhost") || origin.endsWith(".vercel.app")) {
            headers.set("Access-Control-Allow-Origin", origin);
            headers.set("Vary", "Origin");
            headers.set("Access-Control-Allow-Credentials", "true");
            headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
            headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        }
        return new Response(null, { status: 200, headers });
    }

    // Para POST/GET/etc, simplemente permitir que Next.js maneje la request
    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};