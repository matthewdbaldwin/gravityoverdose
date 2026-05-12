# Build + runtime image for a Payload v3 + Next.js app.
# Standalone output is intentionally NOT used: we need the full
# node_modules and src/ available at runtime so `payload migrate`
# can apply schema before `next start`.

FROM node:22.17.0-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---- deps stage: install all deps (including dev) for the build ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# ---- builder stage: compile Next.js ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm run build

# ---- runner stage: prod image ----
FROM base AS runner
ENV NODE_ENV=production

# su-exec lets us start as root (to chown the volume mount) then
# drop privileges to nextjs before running the Node process.
RUN apk add --no-cache su-exec \
 && addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./next.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/src ./src

# Pre-create the media mount point so the volume has somewhere to mount.
RUN mkdir -p /app/media

# Container starts as root so we can chown the volume mount (Railway
# volumes mount as root-owned regardless of image perms), then
# su-exec drops to nextjs for everything afterward.

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["sh", "-c", "chown nextjs:nodejs /app/media && exec su-exec nextjs:nodejs sh -c 'node node_modules/payload/bin.js migrate && node node_modules/next/dist/bin/next start'"]
