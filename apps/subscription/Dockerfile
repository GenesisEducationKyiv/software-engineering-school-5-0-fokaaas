# =============================
# Stage 1: Build
# =============================
FROM node:20.19-alpine3.20 AS builder

WORKDIR src

COPY tsconfig.base.json yarn.lock package.json nx.json ./
COPY apps/subscription/package.json ./apps/subscription/package.json
RUN yarn install --frozen-lockfile

COPY libs/types ./libs/types
COPY apps/subscription ./apps/subscription
RUN npx prisma generate --schema ./apps/subscription/prisma/schema.prisma && \
    npx nx build subscription

# =============================
# Stage 2: Production
# =============================
FROM node:20.19-alpine3.20 AS production

WORKDIR /app

COPY --from=builder /src/apps/subscription/dist/package.json ./dist/package.json
COPY --from=builder /src/apps/subscription/dist/yarn.lock ./dist/yarn.lock
COPY --from=builder /src/apps/subscription/prisma ./dist/prisma
RUN yarn --cwd ./dist install --frozen-lockfile --production && \
    yarn --cwd ./dist prisma generate

COPY --from=builder /src/apps/subscription/dist/main.js ./dist/main.js
COPY libs/proto/common.proto ./libs/proto/common.proto
COPY libs/proto/subscription.proto ./libs/proto/subscription.proto

EXPOSE 4555

CMD ["node", "dist/main.js"]

