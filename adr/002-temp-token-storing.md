# ADR-002: Method for temporarily storing tokens to confirm subscriptions

**Status:** Accepted

**Date:** 2025-06-07

**Author:** Stanislav Basarab

## Context

To confirm user subscriptions (e.g., via email link or code), we need a way to temporarily store one-time tokens. These tokens should be:

- Secure and non-guessable.
- Accessible for a short time window (e.g., 5–15 minutes).
- Automatically removed after expiration.
- Quickly readable and writable with low latency.

Additionally, the system should support concurrent token generation and verification with minimal overhead.

## Considered options

### 1. Redis (with TTL)

**Pros:**
- Extremely fast in-memory store.
- Native support for key expiration via TTL.
- Perfect for short-lived temporary data like tokens, OTPs, sessions.
- Easy to integrate with Node.js/NestJS via popular clients like `ioredis`.

**Cons:**
- Requires running Redis server or container.

---

### 2. PostgreSQL

**Pros:**
- Reuses existing database — no need for additional service.
- Can store tokens with `expires_at` column and clean them up via cron or background jobs.
- ACID compliant and secure.

**Cons:**
- Additional read/write load on primary DB.
- Manual cleanup needed (or scheduled job).
- Slower response time compared to in-memory store.
- Adds schema and logic complexity for data that's meant to be temporary.

---

### 3. In-memory (per-process)

**Pros:**
- Easiest to implement — use a simple JS object or Map.
- No external dependencies.

**Cons:**
- Not scalable — each instance has its own memory.
- Tokens lost if process restarts.
- Doesn't work in multi-instance environments.
- No persistence or proper TTL control.

## Decision

We chose **Redis** with key expiration (TTL) to store confirmation tokens temporarily.

## Consequences

### Positive
- Fast, scalable, and purpose-built for this kind of use case.
- Automatic expiration — no need for manual cleanup.
- Decoupled from main database schema.
- Easily deployable with Docker in dev/prod environments.

### Negative
- Requires Redis service to be running and reachable.


