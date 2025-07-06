# =============================
# Stage 1: Build
# =============================
FROM node:20.19-alpine3.20 AS builder

WORKDIR /app

COPY yarn.lock package.json ./
COPY apps/subscription/package.json ./apps/subscription/package.json

COPY . ./
RUN yarn install --frozen-lockfile && \
    yarn prisma generate --schema ./apps/subscription/prisma/schema.prisma

COPY . .

RUN yarn build:subscription

# =============================
# Stage 2: Production
# =============================
FROM node:20.19-alpine3.20 AS production
ENV NODE_ENV=prod

WORKDIR /app

COPY --from=builder /app/apps/subscription/dist ./
COPY --from=builder /app/apps/subscription/prisma ./prisma
COPY --from=builder /app/libs/proto ./libs/proto

RUN yarn install --frozen-lockfile --production && \
    yarn prisma generate

EXPOSE 4555

CMD ["node", "main.js"]

