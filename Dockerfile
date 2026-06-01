FROM node:22-alpine AS build
WORKDIR /app
# Default matches VPS deploy at andromeda.andrescortes.dev (API on service subdomain).
# For Docker-only with repo nginx.conf proxy, pass: --build-arg VITE_API_BASE_URL=/api
ARG VITE_API_BASE_URL=https://service.andromeda.andrescortes.dev
ARG VITE_MEDIA_BASE_URL=https://admin.andromeda.andrescortes.dev/storage
ENV VITE_MEDIA_BASE_URL=$VITE_MEDIA_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
