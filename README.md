# Virtual Store App

Aplicación de boletería para eventos desarrollada con ASP.NET Core, React y PostgreSQL. El proyecto quedó organizado para trabajar el frontend de forma independiente y conectarlo con el backend mediante endpoints REST.

## Avances Realizados

- Organicé el frontend en la carpeta `front` usando React con Vite.
- Reemplacé la vista demo anterior por una interfaz profesional para cartelera de eventos.
- Implementé una identidad visual basada en la paleta:
  - `#001A6E`
  - `#074799`
  - `#009990`
  - `#E1FFBB`
- Integré el logo de OrbiX en la navegación principal.
- Construí pantallas para:
  - Cartelera de eventos.
  - Búsqueda por nombre, ciudad, categoría y fecha.
  - Detalle de evento.
  - Selección de zona.
  - Campo visual de sillas seleccionables.
  - Inicio de sesión.
  - Favoritos.
  - Historial de compras.
  - Perfil de usuario.
  - PQRS.
- Ajusté la navegación para que las secciones privadas no se muestren como disponibles sin sesión.
- Mejoré el flujo de compra para que el usuario deba iniciar sesión antes de seleccionar sillas y crear una orden.
- Conecté el frontend con el backend a través de una URL configurable.
- Agregué un backend API para consultar eventos, zonas y sillas desde PostgreSQL.
- Configuré Entity Framework Core con Npgsql para la conexión con PostgreSQL.
- Agregué modelos de datos para eventos, zonas, sillas, tickets, usuarios, favoritos y PQRS.
- Preparé Docker para frontend, backend y entorno de base de datos.
- Agregué un archivo `docker-compose.yml` para levantar los servicios del proyecto.
- Agregué un script seed opcional para cargar eventos, zonas y sillas de prueba.

## Estructura Principal

```text
front/
  src/
    components/
    pages/
    services/
    styles/
    data/
    utils/

Controllers/
  Api/

Data/
  VirtualStoreDbContext.cs

Models/
  Dtos/
  Entities/

database/
  seeds/
```

## Frontend

El frontend está en `front` y utiliza React con Vite.

```powershell
cd front
npm install
npm run dev
```

URL local:

```text
http://localhost:5173
```

## Backend

El backend expone endpoints REST para alimentar la cartelera y el flujo de selección de sillas.

Endpoints principales:

```text
GET /api/events
GET /api/events/{id}
GET /api/events/{id}/areas
GET /api/events/{id}/seats
```

## Variables de Entorno

Crear un archivo `.env` a partir de `.env.example` y configurar los valores reales del entorno.

```env
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
BACKEND_PORT=8080
FRONT_PORT=5173
VITE_API_BASE_URL=http://localhost:8080/api
```

## Docker

Para levantar el frontend y backend:

```powershell
docker compose up --build
```

Para reconstruir solo el frontend:

```powershell
docker build -t virtual-store-front --build-arg VITE_API_BASE_URL=http://localhost:8080/api ./front
docker run --rm -d --name virtual-store-front-preview -p 5173:80 virtual-store-front
```

Para reconstruir solo el backend:

```powershell
docker build -t virtual-store-backend .
docker run --rm -d --name virtual-store-backend-preview -p 8080:8080 virtual-store-backend
```

## Base de Datos

La integración con PostgreSQL se realiza desde el backend usando la cadena de conexión configurada por variables de entorno.

Tablas principales usadas:

```text
events
event_area
area_seats
tickets
users
favorites
pqrs
pqrs_responses
```

## Seed Opcional

El archivo `database/seeds/2026-05-virtual-store-events.sql` agrega eventos, zonas y sillas de prueba para enriquecer la cartelera.

Debe revisarse antes de ejecutarlo en una base compartida.
