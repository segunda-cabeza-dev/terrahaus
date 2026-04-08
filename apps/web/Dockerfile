# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci -w @terrahaus/web

FROM deps AS build
WORKDIR /app

ARG VITE_GTM_ID=""
ENV VITE_GTM_ID=${VITE_GTM_ID}

COPY apps/web ./apps/web
COPY packages/shared ./packages/shared

RUN npm run build -w @terrahaus/web

FROM deps AS dev
WORKDIR /app

COPY apps/web ./apps/web
COPY packages/shared ./packages/shared

ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=1
EXPOSE 5173

CMD ["npm", "run", "dev", "-w", "@terrahaus/web", "--", "--host", "0.0.0.0", "--port", "5173"]

FROM nginx:alpine AS production

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
