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

## Variables

Crear un archivo `.env` en la raiz tomando como base `.env.example`.

```env
FRONT_PORT=5173
VITE_API_BASE_URL=/api
```

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
docker build -t virtual-store-front --build-arg VITE_API_BASE_URL=/api .
docker run --rm -p 5173:80 virtual-store-front
```
