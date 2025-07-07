# ADR-005: Decompose monolith into microservices

**Status:** Accepted

**Date:** 2025-06-07

**Author:** Stanislav Basarab

## Context

Our system originally was planned as a single monolithic Node.js application.
All features - weather data integration, subscription management, email notifications,
and client HTTP endpoints - will be bundled in one deployable unit.

This architecture will be work initially but became increasingly problematic as our requirements evolved:
- teams were blocked by tight coupling of unrelated modules
- single bug or failure in one area could affect the entire system 
- scaling individual features independently was impossible
- CI/CD pipelines became slower as any small change required a full redeploy
- long-term maintainability and onboarding new engineers was more difficult

To address these pain points, we decided to decompose the monolith into clearly bounded, 
independently deployable microservices.

## Goals

1. Isolate domain responsibilities so each service can be developed, deployed, and scaled independently. 
2. Enforce clear contracts for inter-service communication. 
3. Improve resilience, so failures in one domain do not cascade. 
4. Enable specialized storage and caching solutions where needed. 
5. Align with our technical stack - NestJS, gRPC, Redis, PostgreSQL.

## High-level architecture

Based on the current business domains, we decided to split the system into:
1. **Gateway** - single entry point for all client requests, providing HTTP/REST APIs and translating them into gRPC calls to internal services.
2. **Weather Service** - integrates with external weather APIs, caches data in Redis, and applies domain-specific logic for weather data. 
3. **Subscription Service** - handles subscriptions, save unconfirmed data in Redis, and stores persistent data in PostgreSQL.
4. **Email Service** - handles email sending via SMTP.

Shared code (common libraries, types, proto) lives in a dedicated libs layer.

A shared **Redis** cluster and **PostgreSQL** instance are used for caching and durable storage where appropriate.

## Detailed responsibilities

1. **Gateway**
   - Accepts all HTTP requests from clients. 
   - Handles authentication, validation, and routing. 
   - Uses **gRPC** to communicate with `Weather`, `Subscription`, and `Email `services. 
   - Does not contain domain logic - acts purely as a thin proxy and aggregator.

2. **Weather Service**
    - Responsible for fetching and normalizing weather data from multiple **external APIs**.
    - Applies any domain-specific enrichment, caching, or fallback logic.
    - Stores frequently requested forecasts in **Redis** for faster retrieval.
    - Exposes gRPC methods for the Gateway to fetch weather data.
    - Uses a `"weather"` prefix for its **Redis** keys to avoid collisions.

3. **Subscription Service**
   - Owns the subscription domain. 
   - Uses PostgreSQL for durable data storage. 
   - Cache unconfirmed subscriptions in Redis with a `"subscription"` prefix for fast access.
   - Exposes gRPC APIs to Gateway

4. **Email Service**
   - Handles all email sending logic.
   - Uses **SMTP** for delivery, with retry logic and error handling.
   - Exposes gRPC methods for the Gateway to trigger email notifications.

## Considered options

### 🗂️ 1. Monolithic architecture

**Pros:**
- Simplicity in deployment and management.
- Easier to develop initially with fewer moving parts.
- No inter-service communication overhead.

**Cons:**
- Difficult to scale individual features.
- Does not solve our core problems: team coupling, scalability, resilience.
- Any outage or bug affects the whole system.

### ⚡ 2. Service decomposition with direct HTTP

**Pros:**
- Easy to inspect payloads.
- No additional serialization format (Protobuf).

**Cons:**
- No enforced contracts between services.
- Higher latency and payload size compared to binary protocols.
- Requires manual schema synchronization and validation logic.

### 🛠️ 3. Service decomposition with gRPC

**Pros:**
- Strongly typed contracts with `.proto` files.
- Low-latency communication using HTTP/2 and Protobuf serialization.
- Familiar NestJS microservices transport layer.

**Cons:**
- Slightly more complex setup (requires `.proto` files).
- Harder to inspect manually (compared to JSON APIs).
- Error handling is more structured but less flexible than HTTP/REST.

## Decision

We chose to split the monolith into **four clearly bounded microservices**: 
Gateway, Weather, Subscription, and Email. They communicate via gRPC for fast, 
type-safe request-response flows. Redis and PostgreSQL are used where appropriate to align with each domain’s needs.

This aligns well with our domain boundaries. 
It also improves maintainability, deployment flexibility, and long-term resilience.

## Consequences

### Positive
- Domain logic is now isolated, enabling faster iteration.
- Small, focused deployable units.
- Gateway abstracts client-facing API - services can evolve independently. 
- Redis and Postgres are used optimally per service. 
- Good alignment with NestJS microservices ecosystem.

### Negative
- Adds operational overhead for inter-service networking. 
- Requires `.proto` contract maintenance for gRPC.
