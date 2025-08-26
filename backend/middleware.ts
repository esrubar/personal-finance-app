// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isAllowedOrigin = (origin: string) => {
    if (!origin) return false;
    // Localhost (cubre 3000, 5173, etc.) y cualquier subdominio *.vercel.app
    return origin.startsWith("http://localhost") || origin.endsWith(".vercel.app");
};

export function middleware(req: NextRequest) {
    const origin = req.headers.get("origin") || "";

    // Preflight (OPTIONS) → responder aquí mismo
    if (req.method === "OPTIONS") {
        const headers = new Headers();
        if (isAllowedOrigin(origin)) {
            headers.set("Access-Control-Allow-Origin", origin);
            headers.set("Vary", "Origin"); // imprescindible cuando reflejas el origin
            headers.set("Access-Control-Allow-Credentials", "true");
            headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
            headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        }
        // 204 No Content es la respuesta típica para preflight
        return new Response(null, { status: 204, headers });
    }

    // Para el resto de métodos, deja que Next.js resuelva el endpoint
    // (las respuestas JSON/cookies las construyes en el handler)
    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};
