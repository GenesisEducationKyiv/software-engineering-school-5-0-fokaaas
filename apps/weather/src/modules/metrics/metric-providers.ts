import {
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';
import { Metrics } from './constants/metrics.const';

export const MetricProviders = [
  makeCounterProvider({
    name: Metrics.CACHE_HIT_TOTAL,
    help: 'Total number of cache hits',
    labelNames: ['method'],
  }),

  makeCounterProvider({
    name: Metrics.CACHE_MISS_TOTAL,
    help: 'Total number of cache misses',
    labelNames: ['method'],
  }),

  makeHistogramProvider({
    name: Metrics.RESPONSE_TIME_SECONDS,
    help: 'Time taken to serve weather data (cache or miss)',
    labelNames: ['method'],
    buckets: [0.001, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2],
  }),
];
