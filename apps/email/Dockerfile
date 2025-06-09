# =============================
# Stage 1: Build
# =============================
FROM node:20.19-alpine3.20 AS builder

WORKDIR src

COPY tsconfig.base.json yarn.lock package.json nx.json ./
COPY apps/email/package.json ./apps/email/package.json
RUN yarn install --frozen-lockfile

COPY libs/types ./libs/types
COPY apps/email ./apps/email
RUN npx nx build email

# =============================
# Stage 2: Production
# =============================
FROM node:20.19-alpine3.20 AS production

WORKDIR /app

COPY --from=builder /src/apps/email/dist/package.json ./dist/package.json
COPY --from=builder /src/apps/email/dist/yarn.lock ./dist/yarn.lock
RUN yarn --cwd ./dist install --frozen-lockfile --production

COPY --from=builder /src/apps/email/dist/main.js ./dist/main.js
COPY --from=builder /src/apps/email/templates ./templates
COPY libs/proto/email.proto ./libs/proto/email.proto

EXPOSE 4557

CMD ["node", "dist/main.js"]
