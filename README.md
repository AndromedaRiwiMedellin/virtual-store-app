# OrbiX Frontend

Frontend de OrbiX construido con React y Vite. La aplicacion consume la API de Andromeda para mostrar eventos, autenticar usuarios, consultar disponibilidad, comprar entradas, generar QR digital y gestionar PQRS.

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

Desde la raiz del repositorio:

```powershell
docker compose up --build
```

O construyendo solo la imagen:

```powershell
docker build -t virtual-store-front --build-arg VITE_API_BASE_URL=/api .
docker run --rm -p 5173:80 virtual-store-front
```
