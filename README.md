# WeatherApi

This is a simple weather API that provides current weather data for any location and subscriptions to weather updates.

## Tech Stack

- TypeScript
- NestJS (Application, Microservices)
- gRPC
- Prima ORM
- Jest
- Docker
- PostgreSQL
- Redis

## Structure

Project contains:
- 3 microservices (Weather, Subscription, Email)
- 1 application (Gateway)
- 1 database (PostgreSQL)
- 1 in-memory database (Redis)

**Gateway** is responsible for routing requests to the appropriate microservice. It also communicates with microservices using gRPC.
**Weather** is responsible for fetching current weather data from WeatherMap API.
**Subscription** microservice is responsible for managing subscriptions to weather updates. It communicates with PostgreSQL database to store subscription data and Redis to manage confirmation tokens.
**Email** microservice is responsible for sending emails to users.

![image](https://github.com/user-attachments/assets/35ac63a1-438f-4ce4-a204-9de8a6e58c14)

## Getting Started

1. Clone the repository

```bash
git clone git@github.com:fokaaas/weather-api.git
```

2. Install dependencies

```bash
yarn install
```

3. Create a `.env` files in each app directory and fill them with the required environment variables. You can use `.env.sample` as a reference.

For `apps/gateway`:

```dotenv
# common
PORT=

# weather
WEATHER_HOST=
WEATHER_PORT=

# email
EMAIL_HOST=
EMAIL_PORT=

# subscription
SUBSCRIPTION_HOST=
SUBSCRIPTION_PORT=
```

For `apps/weather`:

```dotenv
# common
PORT=

# Weather API
WEATHER_API_KEY=
WEATHER_API_URL=
```

For `apps/subscription`:

```dotenv
# common
PORT=
DATABASE_URL=

# redis
REDIS_HOST=
REDIS_PORT=
REDIS_TTL=
```

For `apps/email`:

```dotenv
# common
PORT=
FRONT_BASE_URL=

# smtp
SMTP_HOST=
SMTP_USERNAME=
SMTP_PASSWORD=
```

4. Start applications

```bash
yarn start
```

## Testing

Tests were written for the weather service using Jest.
You can see the tests in the `apps/gateway/src/app/weather/weatcher.service.spec.ts` file.

## Docker

Dockerfiles are provided for each microservice and the gateway.
For example, Gateway multi-stage Dockerfile:

```dockerfile
# =============================
# Stage 1: Build
# =============================
FROM node:20.19-alpine3.20 AS builder

WORKDIR src

COPY tsconfig.base.json yarn.lock package.json nx.json ./
COPY apps/email/package.json ./apps/email/package.json
RUN yarn install --frozen-lockfile

COPY libs/types ./libs/interfaces
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
```

Also, docker-compose file is provided for running all microservices, gateway, PostgreSQL, Redis. Prepare environment variables in `.env` file and run:

```bash
docker-compose up -d
```

## Deployment

This project is deployed on Azure VM.

![image](https://github.com/user-attachments/assets/1d84d78a-a3c0-4985-8bbb-350d4a3c591a)
