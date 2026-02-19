# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS deps
WORKDIR /app

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci -w @terrahaus/api

FROM deps AS dev
WORKDIR /app

COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

RUN npm run prisma:generate -w @terrahaus/api

ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH
EXPOSE 3000

WORKDIR /app/apps/api
CMD ["npm", "run", "dev"]

FROM deps AS build
WORKDIR /app

COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

RUN npm run prisma:generate -w @terrahaus/api
RUN npm run build -w @terrahaus/api

FROM node:20-bookworm-slim AS prod-deps
WORKDIR /app

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci -w @terrahaus/api --omit=dev

FROM node:20-bookworm-slim AS runner
WORKDIR /app

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

ARG GIT_SHA=""
ARG GIT_REF=""
ARG APP_VERSION=""

ENV NODE_ENV=production
ENV PATH=/app/node_modules/.bin:$PATH
ENV GIT_SHA=$GIT_SHA
ENV GIT_REF=$GIT_REF
ENV APP_VERSION=$APP_VERSION

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/apps/api/prisma ./apps/api/prisma

EXPOSE 3000
CMD ["node", "apps/api/dist/index.js"]
