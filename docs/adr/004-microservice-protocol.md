# ADR-004: Choose protocol for microservices communication

**Status:** Accepted

**Date:** 2025-06-07

**Author:** Stanislav Basarab

## Context

Our system is built as a set of microservices. And gateway must communicate with these microservices efficiently and reliably. We need a protocol that meets the following requirements:

- **High performance and low latency** between services.
- **Strong typing and schema enforcement** to avoid inconsistencies.
- Support for **bi-directional communication**.
- Compatibility with **NestJS**, our framework of choice.
- Maintainability and clarity of API contracts.

We evaluated multiple protocols to determine the best fit for our architecture.

## Considered options

### 1. gRPC

**Pros:**
- Extremely efficient and low-latency due to HTTP/2 and Protobuf serialization.
- Strongly typed contracts with `.proto` files.
- Bi-directional streaming out of the box.
- Good support in NestJS.
- Widely adopted in high-performance systems and cloud-native platforms.

**Cons:**
- Slightly more complex setup (requires `.proto` files).
- Harder to inspect manually (compared to JSON APIs).
- Error handling is more structured but less flexible than HTTP/REST.

---

### 2. REST over HTTP

**Pros:**
- Simple and human-readable.
- Widely supported and understood.
- Easy to integrate with third-party tools.

**Cons:**
- No enforced typing across services.
- Higher payload sizes and slower than binary protocols.
- Requires manual schema synchronization and validation logic.

---

### 3. Message Queue (e.g., RabbitMQ)

**Pros:**
- Asynchronous, decoupled communication.
- Supports retries, dead-letter queues, and complex routing patterns.
- Ideal for event-driven or loosely coupled systems.

**Cons:**
- Higher complexity (broker setup, message tracking).
- Not ideal for request-response interactions (adds latency).
- Message formats are arbitrary (JSON, Protobuf, etc.) and need manual validation.

## Decision

We chose **gRPC** as it offers high-performance, strongly typed communication with excellent NestJS support. Its Protobuf-based contracts ensure consistency across services and make the system scalable for future streaming use cases.

## Consequences

### Positive
- Efficient and structured communication with low latency.
- Type-safe, versioned contracts using `.proto` files.
- Scalable architecture that supports future streaming or batch use cases.
- Good integration with NestJS microservices and tooling for code generation.

### Negative
- Requires maintaining `.proto` files and keeping them in sync across services.
- Harder to debug or inspect payloads manually.

