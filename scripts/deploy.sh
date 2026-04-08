#!/usr/bin/env bash

set -euo pipefail

DEPLOY_HOST="${DEPLOY_HOST:-root@65.21.215.162}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/terrahaus}"

REMOTE_COMPOSE_FILES=(
  -f docker-compose.prod.yml
  -f docker-compose.prod.traefik.yml
  -f docker-compose.prod.leads.yml
)

RSYNC_EXCLUDES=(
  --exclude .git
  --exclude node_modules
  --exclude apps/web/node_modules
  --exclude apps/api/node_modules
  --exclude dist
  --exclude apps/web/dist
  --exclude apps/api/dist
  --exclude .env
)

echo "Syncing workspace to ${DEPLOY_HOST}:${DEPLOY_PATH}"
rsync -az "${RSYNC_EXCLUDES[@]}" ./ "${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "Building production images on ${DEPLOY_HOST}"
ssh "${DEPLOY_HOST}" "cd ${DEPLOY_PATH} && docker build -f apps/api/Dockerfile -t terrahaus-api:main . && docker build -f apps/web/Dockerfile -t terrahaus-web:main ."

echo "Running database migrations on ${DEPLOY_HOST}"
ssh "${DEPLOY_HOST}" "cd ${DEPLOY_PATH} && docker compose ${REMOTE_COMPOSE_FILES[*]} run --rm migrate"

echo "Recreating api and web services on ${DEPLOY_HOST}"
ssh "${DEPLOY_HOST}" "cd ${DEPLOY_PATH} && docker compose ${REMOTE_COMPOSE_FILES[*]} up -d --force-recreate api web"

echo "Current Terrahaus containers:"
ssh "${DEPLOY_HOST}" "docker ps --format '{{.Names}}\t{{.Image}}\t{{.Status}}' | grep '^terrahaus-'"
