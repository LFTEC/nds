FROM node:22.15.0-alpine3.21 AS base

#Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --force

#build project
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

#Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nds 
RUN adduser --system --uid 1001 nds 
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/prisma ./prisma
COPY --from=builder --chown=nds:nds /app/.next/standalone ./
COPY --from=builder --chown=nds:nds /app/.next/static ./.next/static
USER nds
EXPOSE 9000
ENV PORT=9000
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT [ "node", "server.js" ]



