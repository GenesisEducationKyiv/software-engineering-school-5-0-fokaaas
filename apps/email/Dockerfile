# =============================
# Stage 1: Build
# =============================
FROM node:20.19-alpine3.20 AS builder

WORKDIR /app

COPY yarn.lock package.json ./
COPY apps/email/package.json ./apps/email/package.json

COPY . ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build:email

# =============================
# Stage 2: Production
# =============================
FROM node:20.19-alpine3.20 AS production
ENV NODE_ENV=prod

WORKDIR /app

COPY --from=builder /app/apps/email/dist ./
COPY --from=builder /app/libs/proto ./libs/proto
COPY --from=builder /app/apps/email/templates /templates

RUN yarn install --frozen-lockfile --production

EXPOSE 4555

CMD ["node", "main.js"]
