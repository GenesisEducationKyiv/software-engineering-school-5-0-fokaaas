import { Injectable } from '@nestjs/common';
import { Counter, Histogram } from '@opentelemetry/api';
import { meter } from '../../common/meter';
import {
  Disposable,
  MetricsServiceInterface,
} from './interfaces/metrics-service.interface';

@Injectable()
export class MetricsService implements MetricsServiceInterface {
  private readonly responseTime: Histogram;
  private readonly cacheHit: Counter;
  private readonly cacheMiss: Counter;

  constructor() {
    this.responseTime = meter.createHistogram('weather_response_time_ms', {
      description: 'Response time for weather service calls',
      advice: {
        explicitBucketBoundaries: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
      },
    });

    this.cacheHit = meter.createCounter('weather_cache_hit_total', {
      description: 'Number of cache hits',
    });

    this.cacheMiss = meter.createCounter('weather_cache_miss_total', {
      description: 'Number of cache misses',
    });
  }

  incCacheHit(method: string): void {
    this.cacheHit.add(1, { method });
  }

  incCacheMiss(method: string): void {
    this.cacheMiss.add(1, { method });
  }

  measureResponseTime(method: string): Disposable {
    const start = performance.now();
    const histogram = this.responseTime;

    return {
      [Symbol.dispose]() {
        const duration = performance.now() - start;
        histogram.record(duration, { method });
      },
    };
  }
}
