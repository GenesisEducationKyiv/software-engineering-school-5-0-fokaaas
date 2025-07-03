import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Metrics } from './constants/metrics.const';
import {
  Counter,
  Histogram,
  Pushgateway,
  RegistryContentType,
} from 'prom-client';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric(Metrics.CACHE_HIT_TOTAL)
    private readonly cacheHitTotalCounter: Counter<string>,

    @InjectMetric(Metrics.CACHE_MISS_TOTAL)
    private readonly cacheMissTotalCounter: Counter<string>,

    @InjectMetric(Metrics.RESPONSE_TIME_SECONDS)
    private readonly responseTimeSecondsHistogram: Histogram<string>,

    private readonly gateway: Pushgateway<RegistryContentType>
  ) {}

  incCacheHit(method: string): void {
    this.cacheHitTotalCounter.inc({ method });
  }

  incCacheMiss(method: string): void {
    this.cacheMissTotalCounter.inc({ method });
  }

  async withResponseTime<T>(fn: () => Promise<T>, method: string): Promise<T> {
    const end = this.responseTimeSecondsHistogram.startTimer();
    const result = await fn();
    end({ method });
    return result;
  }

  @Interval(5000)
  async pushToGatewayInterval() {
    await this.gateway.pushAdd({ jobName: 'weather-microservice' });
  }
}
