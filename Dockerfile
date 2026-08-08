# ============================================
# Dependencies Stage
# ============================================
FROM node:20-alpine AS deps
WORKDIR /app

RUN corepack enable

# Copy workspace config
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml* ./

RUN --mount=type=cache,target=/root/.local/share/pnpm/store/v3 \
  pnpm fetch
# --ignore-scripts: husky install fails without a git repo; postinstall
# (fumadocs-mdx) is run explicitly in the builder stage instead.
RUN --mount=type=cache,target=/root/.local/share/pnpm/store/v3 \
  pnpm install --frozen-lockfile --offline --ignore-scripts

# ============================================
# Build Stage
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY --from=deps /app ./
COPY . .

ARG SKIP_ENV_VALIDATION
ENV SKIP_ENV_VALIDATION=${SKIP_ENV_VALIDATION:-1}

ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

## Generate fumadocs MDX cache (skipped during install)
RUN --mount=type=cache,target=/root/.local/share/pnpm/store/v3 \
  pnpm --filter docs run postinstall

## turbo builds @oprogress packages (core -> react -> next) then docs
RUN --mount=type=cache,target=/root/.local/share/pnpm/store/v3 \
  pnpm build

# ============================================
# Runtime Stage
# ============================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Standalone output lives under apps/docs in a monorepo
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/static ./apps/docs/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/docs/server.js"]