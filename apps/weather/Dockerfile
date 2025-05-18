# =============================
# Stage 1: Build
# =============================
FROM node:20.19-alpine3.20 AS builder

WORKDIR src

COPY tsconfig.base.json yarn.lock package.json nx.json ./
COPY apps/weather/package.json ./apps/weather/package.json
RUN yarn install --frozen-lockfile

COPY libs/interfaces ./libs/interfaces
COPY apps/weather ./apps/weather
RUN npx nx build weather

# =============================
# Stage 2: Production
# =============================
FROM node:20.19-alpine3.20 AS production

WORKDIR /app

COPY --from=builder /src/apps/weather/dist/package.json ./dist/package.json
COPY --from=builder /src/apps/weather/dist/yarn.lock ./dist/yarn.lock
RUN yarn --cwd ./dist install --frozen-lockfile --production

COPY --from=builder /src/apps/weather/dist/main.js ./dist/main.js
COPY libs/proto/weather.proto ./libs/proto/weather.proto

EXPOSE 4556

CMD ["node", "dist/main.js"]

