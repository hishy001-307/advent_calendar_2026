# syntax=docker/dockerfile:1

# ============================================
# Base image
# ============================================
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies based on the preferred package manager
# package-lock.json を優先（pnpm-lock.yaml が古い場合に対応）
RUN \
  if [ -f package-lock.json ]; then \
    npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm i --frozen-lockfile; \
  else \
    echo "No lockfile available." && exit 1; \
  fi

# ============================================
# Build stage
# ============================================
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================================
# Production（`output: "export"` の `out/` のみ配信。`next start` は不可）
# ============================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm install -g serve@14.2.4

COPY --from=builder /app/out ./out

EXPOSE 3000

# 本番が https://host/physlab2026/ のときは out の中身をそのパス配下に置くか、
# リバプロでパスを合わせる（HTML は /physlab2026/_next/... を参照する）。
CMD ["serve", "out", "-l", "3000", "--no-port-switching"]
