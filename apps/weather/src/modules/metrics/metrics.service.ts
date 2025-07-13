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
import { MetricsServiceInterface } from './interfaces/metrics-service.interface';

@Injectable()
export class MetricsService implements MetricsServiceInterface {
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

  createResponseTimer(method: string) {
    const end = this.responseTimeSecondsHistogram.startTimer();
    return {
      [Symbol.dispose]: () => {
        end({ method });
      },
    };
  }

  @Interval(5000)
  async pushToGatewayInterval() {
    await this.gateway.pushAdd({ jobName: 'weather-microservice' });
  }
}
