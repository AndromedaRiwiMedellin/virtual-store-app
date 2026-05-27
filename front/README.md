# OrbiX Eventos Frontend

Frontend React para la tienda virtual de eventos. Esta carpeta reemplaza la demo anterior y deja una base organizada para conectar con el backend y PostgreSQL.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Docker

```bash
docker build -t virtual-store-front ./front
docker run --rm -p 5173:80 virtual-store-front
```

## Estructura

- `src/components`: piezas reutilizables de UI.
- `src/pages`: vistas principales asociadas a historias de usuario.
- `src/data`: datos temporales mientras se conecta la API.
- `src/styles`: estilos globales y sistema visual.
