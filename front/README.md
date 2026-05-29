# OrbiX Eventos Frontend

Frontend React para la tienda virtual de eventos. La aplicacion consume la API desplegada y mantiene separada la interfaz del resto de servicios de la organizacion.

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
- `src/data`: datos de respaldo para la interfaz.
- `src/styles`: estilos globales y sistema visual.
