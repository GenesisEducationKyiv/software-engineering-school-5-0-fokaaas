import { MetricsService } from './metrics.service';
import { Test } from '@nestjs/testing';
import { MetricsModule } from './metrics.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../common/config/configuration';
import { register } from 'prom-client';

jest.mock('@nestjs/schedule', () => ({
  ...jest.requireActual('@nestjs/schedule'),
  Interval: () => () => {
    /* mock interval */
  },
}));

describe('MetricsService', () => {
  let service: MetricsService;

  let getMetrics: () => Promise<string>;
  let gatewayUrl: string;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        MetricsModule,
      ],
    }).compile();

    service = moduleRef.get(MetricsService);
    const config = moduleRef.get(ConfigService);

    gatewayUrl = config.getOrThrow<string>('metrics.gatewayUrl');

    getMetrics = async () => {
      const response = await fetch(`${gatewayUrl}/metrics`);
      return response.text();
    };
  });

  afterEach(async () => {
    // clear metrics after each test
    await fetch(`${gatewayUrl}/metrics/job/weather-microservice`, {
      method: 'DELETE',
    });
    register.clear();
  });

  describe('incCacheHit', () => {
    it('should increment cache hit counter', async () => {
      service.incCacheHit('testMethod');

      await service.pushToGatewayInterval();

      const metrics = await getMetrics();
      expect(metrics).toContain(
        'cache_hit_total{instance="",job="weather-microservice",method="testMethod"} 1'
      );
    });

    it('should increment cache hit counter multiple times', async () => {
      service.incCacheHit('testMethod');
      service.incCacheHit('testMethod');

      await service.pushToGatewayInterval();

      const metrics = await getMetrics();
      expect(metrics).toContain(
        'cache_hit_total{instance="",job="weather-microservice",method="testMethod"} 2'
      );
    });
    it('should increment cache hit counter for different methods', async () => {
      service.incCacheHit('methodA');
      service.incCacheHit('methodB');

      await service.pushToGatewayInterval();

      const metrics = await getMetrics();

      [
        'cache_hit_total{instance="",job="weather-microservice",method="methodA"} 1',
        'cache_hit_total{instance="",job="weather-microservice",method="methodB"} 1',
      ].forEach((metric) => {
        expect(metrics).toContain(metric);
      });
    });
  });

  describe('incCacheMiss', () => {
    it('should increment cache miss counter', async () => {
      service.incCacheMiss('testMethod');

      await service.pushToGatewayInterval();

      const metrics = await getMetrics();
      expect(metrics).toContain(
        'cache_miss_total{instance="",job="weather-microservice",method="testMethod"} 1'
      );
    });

    it('should increment cache miss counter multiple times', async () => {
      service.incCacheMiss('testMethod');
      service.incCacheMiss('testMethod');

      await service.pushToGatewayInterval();

      const metrics = await getMetrics();
      expect(metrics).toContain(
        'cache_miss_total{instance="",job="weather-microservice",method="testMethod"} 2'
      );
    });

    it('should increment cache miss counter for different methods', async () => {
      service.incCacheMiss('methodA');
      service.incCacheMiss('methodB');

      await service.pushToGatewayInterval();

      const metrics = await getMetrics();

      [
        'cache_miss_total{instance="",job="weather-microservice",method="methodA"} 1',
        'cache_miss_total{instance="",job="weather-microservice",method="methodB"} 1',
      ].forEach((metric) => expect(metrics).toContain(metric));
    });
  });

  describe('withResponseTime', () => {
    it('should measure response time for a function', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');

      const result = await service.withResponseTime(mockFn, 'testMethod');

      expect(result).toBe('result');
      expect(mockFn).toHaveBeenCalled();

      await service.pushToGatewayInterval();

      const metrics = await getMetrics();

      expect(metrics).toContain(
        'response_time_seconds_count{instance="",job="weather-microservice",method="testMethod"} 1'
      );
    });

    it('should measure response time with multiple buckets', async () => {
      const mockFn = jest.fn().mockImplementation(async () => {
        await new Promise((res) => setTimeout(res, 10));
        return 'result';
      });

      const result = await service.withResponseTime(mockFn, 'testMethod');

      expect(result).toBe('result');
      expect(mockFn).toHaveBeenCalled();

      await service.pushToGatewayInterval();

      const metrics = await getMetrics();
      [
        'response_time_seconds_bucket{instance="",job="weather-microservice",method="testMethod",le="0.001"} 0',
        'response_time_seconds_bucket{instance="",job="weather-microservice",method="testMethod",le="0.01"} 0',
        'response_time_seconds_bucket{instance="",job="weather-microservice",method="testMethod",le="0.05"} 1',
        'response_time_seconds_count{instance="",job="weather-microservice",method="testMethod"} 1',
      ].forEach((metric) => expect(metrics).toContain(metric));
    });
  });
});
