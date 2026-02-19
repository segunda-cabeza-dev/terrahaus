# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/shared/package*.json ./packages/shared/

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build:web

# Production stage - Nginx para servir archivos estáticos
FROM nginx:alpine AS production

# Copiar configuración de nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos build
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
