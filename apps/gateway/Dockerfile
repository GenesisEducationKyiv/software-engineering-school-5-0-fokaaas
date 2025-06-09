# =============================
# Stage 1: Build
# =============================
FROM node:20.19-alpine3.20 AS builder

WORKDIR src

COPY tsconfig.base.json yarn.lock package.json nx.json ./
COPY apps/gateway/package.json ./apps/gateway/package.json
RUN yarn install --frozen-lockfile

COPY libs/types ./libs/types
COPY apps/gateway ./apps/gateway
RUN npx nx build gateway

# =============================
# Stage 2: Production
# =============================
FROM node:20.19-alpine3.20 AS production

WORKDIR /app

COPY --from=builder /src/apps/gateway/dist/package.json ./dist/package.json
COPY --from=builder /src/apps/gateway/dist/yarn.lock ./dist/yarn.lock
RUN yarn --cwd ./dist install --frozen-lockfile --production

COPY --from=builder /src/apps/gateway/dist/main.js ./dist/main.js
COPY libs/proto ./libs/proto

EXPOSE 4555

CMD ["node", "dist/main.js"]
