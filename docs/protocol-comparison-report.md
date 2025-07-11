# Protocol Comparison Report (HTTP vs. gRPC)

This report compares the two primary protocols used in microservices architecture: HTTP and gRPC.
Only high-traffic endpoint was included in the comparison, as it is the most relevant for performance evaluation.

## Test Configuration

- **Library**: [autocannon](https://www.npmjs.com/package/autocannon).
- **Command**: `autocannon <endpoint>`.
- 3 runs per protocol, use median values for comparison.

## Environment

- CPU: 8-core AMD Ryzen 7 5800H
- RAM: 32GB
- Node.js version: 20.x
- Network: Localhost, 10 connections
- OS: Ubuntu 22.04

## Endpoints

### 1. `GET /api/weather`

**Comparison Summary**

| Aspect         | HTTP Value | gRPC Value | Difference   |
|----------------|------------|------------|--------------|
| Total Requests | \~26,000   | \~24,000   | +8% HTTP     |
| Avg Requests/s | 2,339      | 2,380      | +2% gRPC     |
| 50% Latency    | 3 ms       | 3 ms       | =            |
| Avg Latency    | 3.7 ms     | 3.68 ms    | ≈ Equal      |
| Bytes/s (Avg)  | 765 kB     | 778 kB     | +2% gRPC     |
| Total MB Read  | 8.41 MB    | 7.78 MB    | +8% HTTP     |
| Max Latency    | 600 ms     | 53 ms      | gRPC stabler |


**HTTP Results:**

```
Running 10s test @ http://localhost:4558/api/weather?city=Kyiv
10 connections


┌─────────┬──────┬──────┬───────┬──────┬────────┬──────────┬────────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg    │ Stdev    │ Max    │
├─────────┼──────┼──────┼───────┼──────┼────────┼──────────┼────────┤
│ Latency │ 3 ms │ 3 ms │ 6 ms  │ 7 ms │ 3.7 ms │ 11.73 ms │ 600 ms │
└─────────┴──────┴──────┴───────┴──────┴────────┴──────────┴────────┘
┌───────────┬────────┬────────┬────────┬────────┬──────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg      │ Stdev  │ Min    │
├───────────┼────────┼────────┼────────┼────────┼──────────┼────────┼────────┤
│ Req/Sec   │ 680    │ 680    │ 2,569  │ 2,657  │ 2,339.46 │ 549.15 │ 680    │
├───────────┼────────┼────────┼────────┼────────┼──────────┼────────┼────────┤
│ Bytes/Sec │ 222 kB │ 222 kB │ 840 kB │ 869 kB │ 765 kB   │ 180 kB │ 222 kB │
└───────────┴────────┴────────┴────────┴────────┴──────────┴────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 11

26k requests in 11.02s, 8.41 MB read
```

**gRPC Results:**

```
Running 10s test @ http://localhost:4558/api/weather?city=Kyiv
10 connections


┌─────────┬──────┬──────┬───────┬──────┬─────────┬─────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%  │ Avg     │ Stdev   │ Max   │
├─────────┼──────┼──────┼───────┼──────┼─────────┼─────────┼───────┤
│ Latency │ 3 ms │ 3 ms │ 7 ms  │ 8 ms │ 3.68 ms │ 1.55 ms │ 53 ms │
└─────────┴──────┴──────┴───────┴──────┴─────────┴─────────┴───────┘
┌───────────┬────────┬────────┬────────┬────────┬─────────┬────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg     │ Stdev  │ Min    │
├───────────┼────────┼────────┼────────┼────────┼─────────┼────────┼────────┤
│ Req/Sec   │ 1,506  │ 1,506  │ 2,579  │ 2,739  │ 2,379.6 │ 405.99 │ 1,506  │
├───────────┼────────┼────────┼────────┼────────┼─────────┼────────┼────────┤
│ Bytes/Sec │ 493 kB │ 493 kB │ 843 kB │ 895 kB │ 778 kB  │ 133 kB │ 492 kB │
└───────────┴────────┴────────┴────────┴────────┴─────────┴────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 10

24k requests in 10.02s, 7.78 MB read
```

## Conclusions

- Both protocols showed similar average latency and throughput on this endpoint.
- gRPC had slightly better average RPS and much more stable max latency.
- This suggests gRPC is more predictable under high load.
- HTTP handled a bit more total requests, but the difference is small.
- For this system, **gRPC** is a solid choice for efficient and consistent service communication.
