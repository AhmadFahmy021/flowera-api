# syntax=docker/dockerfile:1.7

# ==========================
# Build Stage
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

ENV CI=true

RUN corepack enable && \
    corepack prepare pnpm@11.9.0 --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./

# Install dependencies
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts=false

# Copy source
COPY . .

# Build
RUN pnpm run build

# ==========================
# Production Stage
# ==========================
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable && \
    corepack prepare pnpm@11.9.0 --activate

# Copy package.json
COPY --from=builder /app/package.json ./

# Copy production dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy build result
COPY --from=builder /app/dist ./dist

# Jika ada folder keys bawaan image (opsional)
# COPY --from=builder /app/keys ./keys

EXPOSE 3000

CMD ["node", "dist/main.js"]