# OrbiX Frontend

OrbiX frontend built with React and Vite. The application consumes the Andromeda API to show events, authenticate users, check availability, buy tickets, generate digital QR codes, and manage PQRS.

## Estructura

```text
src/
  assets/
  components/
  data/
  pages/
  services/
  styles/
  utils/
```

## Requisitos

- Node.js 22 o superior.
- Docker Desktop, si se desea correr como contenedor.

## Arquitectura Andromeda

| Host | Rol |
|------|-----|
| `https://andromeda.andrescortes.dev` | App publica OrbiX (este repo) |
| `https://admin.andromeda.andrescortes.dev` | Panel admin / metricas |
| `https://tickets.andromeda.andrescortes.dev` | Venta POS empleados |
| `https://access.andromeda.andrescortes.dev` | Verificacion de tickets |
| `https://service.andromeda.andrescortes.dev` | API ASP.NET (`asp_backend`) |
| `204.168.212.239` | IP del VPS (PostgreSQL, nginx). **No** usar como `VITE_API_BASE_URL` |

La API vive en `service.*`. El IP publico sirve paginas y base de datos, no reemplaza a `service.*`.

## Variables

Crear un archivo `.env` en la raiz tomando como base `.env.example`.

**Produccion** (`andromeda.andrescortes.dev`, archivos estaticos en nginx del VPS):

```env
FRONT_PORT=5173
VITE_API_BASE_URL=https://service.andromeda.andrescortes.dev
VITE_MEDIA_BASE_URL=https://admin.andromeda.andrescortes.dev/storage
```

**Desarrollo local** (`npm run dev`, proxy en `vite.config.js`):

```env
VITE_API_BASE_URL=/api
```

**Docker** con `nginx.conf` de este repo (proxy `/api` interno):

```env
VITE_API_BASE_URL=/api
```

Si el build usa `/api` pero el nginx del VPS **no** tiene `location /api/` (ver `deploy/nginx-andromeda.example.conf`), el navegador recibe `index.html` en lugar de JSON y la app muestra eventos de demostracion (`Noche Andromeda Live`, etc.) en vez de la base de datos.

## Desarrollo Local

```powershell
npm install
npm run dev
```

URL local:

```text
http://localhost:5173
```

## Build

```powershell
npm run build
```

## Docker

From the repository root:

```powershell
docker compose up --build
```

O construyendo solo la imagen:

```powershell
docker build -t virtual-store-front --build-arg VITE_API_BASE_URL=https://service.andromeda.andrescortes.dev .
docker run --rm -p 5173:80 virtual-store-front
```

If you prefer to proxy through a local nginx and keep using `/api`, set `VITE_API_BASE_URL=/api` when building the image.

## Despliegue en VPS (andromeda.andrescortes.dev)

En el servidor, despues de `git pull origin main`:

```powershell
.\scripts\build-production.ps1
# Copiar dist/* al directorio que sirve nginx para andromeda.andrescortes.dev
```

No uses `https://204.168.212.239` como API. El build de produccion debe apuntar a `https://service.andromeda.andrescortes.dev`.

Los posters creados desde el panel admin se sirven desde `https://admin.andromeda.andrescortes.dev/storage`, por eso `VITE_MEDIA_BASE_URL` debe apuntar a ese host hasta que la API sirva archivos estaticos propios.
