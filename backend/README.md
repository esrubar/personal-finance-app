# Personal Finance Backend (Next.js 14 + TS + Mongoose + JWT Cookies)

Endpoints:
- `POST /api/auth/register` { email, password }
- `POST /api/auth/login` { email, password } → set-cookie httpOnly `token`
- `GET  /api/auth/me` → requiere cookie
- `POST /api/auth/logout` → borra cookie
- `GET/POST /api/expenses` → requiere cookie

## Variables de entorno
Copia `.env.example` a `.env`:
```
MONGODB_URI=mongodb+srv://user:pass@cluster0.mongodb.net/personal-finance
JWT_SECRET=supersecret
ALLOWED_ORIGIN=https://tu-frontend.vercel.app
NODE_ENV=production
```

## Despliegue en Vercel (proyectos separados)
- Crea un proyecto en Vercel para **backend** apuntando a este repo/carpeta.
  - Establece las env vars anteriores en Vercel.
- Crea un proyecto en Vercel para **frontend**.
  - Establece `VITE_API_URL` con la URL del backend desplegado.
- Asegúrate de que `ALLOWED_ORIGIN` coincida exactamente con el dominio del frontend (sin barra final).