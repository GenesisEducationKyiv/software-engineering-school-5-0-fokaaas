import { meter } from '../../../common/meter';
import { WeatherData } from '../data/weather.data';
import { ExistsData } from '../data/exists.data';
import { WeatherServiceInterface } from '../interfaces/weather-service.interface';
import { Histogram, Counter } from '@opentelemetry/api';
import { RedisService } from '@shared/modules/redis/redis.service';

export class WeatherCacheProxy implements WeatherServiceInterface {
  private readonly responseTime: Histogram;
  private readonly cacheHit: Counter;
  private readonly cacheMiss: Counter;

  constructor(
    private readonly service: WeatherServiceInterface,
    private readonly redis: RedisService
  ) {
    this.responseTime = meter.createHistogram('weather_response_time_ms', {
      description: 'Response time for weather service calls',
    });

    this.cacheHit = meter.createCounter('weather_cache_hit_total', {
      description: 'Number of cache hits',
    });

    this.cacheMiss = meter.createCounter('weather_cache_miss_total', {
      description: 'Number of cache misses',
    });
  }

  async get(city: string): Promise<WeatherData> {
    const method = 'get';
    using timer = this.measureResponseTime(method);

    const key = city.toLowerCase();
    const cache = await this.redis.getObj<WeatherData>(key);
    if (cache) {
      this.cacheHit.add(1, { method });
      return cache;
    }

    this.cacheMiss.add(1, { method });
    const result = await this.service.get(city);
    await this.redis.setObj(key, result);
    return result;
  }

  async cityExists(city: string): Promise<ExistsData> {
    const method = 'cityExists';
    using timer = this.measureResponseTime(method);

    const key = `exists:${city.toLowerCase()}`;
    const cache = await this.redis.getBool(key);
    if (cache) {
      this.cacheHit.add(1, { method });
      return { exists: cache };
    }

    this.cacheMiss.add(1, { method });
    const result = await this.service.cityExists(city);
    await this.redis.setBool(key, result.exists);
    return result;
  }

  private measureResponseTime(method: string) {
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
