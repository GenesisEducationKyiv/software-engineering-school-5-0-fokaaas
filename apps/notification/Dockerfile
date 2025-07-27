# =============================
# Stage 1: Build
# =============================
FROM node:20.19-alpine3.20 AS builder

WORKDIR /app

COPY yarn.lock package.json ./
COPY apps/notification/package.json ./apps/notification/package.json

COPY . ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build:notification

# =============================
# Stage 2: Production
# =============================
FROM node:20.19-alpine3.20 AS production
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/apps/notification/dist ./
COPY --from=builder /app/libs/proto ./libs/proto

RUN yarn install --frozen-lockfile --production

EXPOSE 4559

CMD ["node", "main.js"]
