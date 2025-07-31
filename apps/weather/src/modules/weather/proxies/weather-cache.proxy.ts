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
    const start = performance.now();
    const method = 'get';

    const key = city.toLowerCase();
    const cache = await this.redis.getObj<WeatherData>(key);
    if (cache) {
      this.cacheHit.add(1, { method });
      this.responseTime.record(performance.now() - start, { method });
      return cache;
    }

    this.cacheMiss.add(1, { method });

    const result = await this.service.get(city);
    await this.redis.setObj(key, result);

    this.responseTime.record(performance.now() - start, { method });
    return result;
  }

  async cityExists(city: string): Promise<ExistsData> {
    const start = performance.now();
    const method = 'cityExists';

    const key = `exists:${city.toLowerCase()}`;
    const cache = await this.redis.getBool(key);
    if (cache) {
      this.cacheHit.add(1, { method });
      this.responseTime.record(performance.now() - start, { method });
      return { exists: cache };
    }

    this.cacheMiss.add(1, { method });

    const result = await this.service.cityExists(city);
    await this.redis.setBool(key, result.exists);

    this.responseTime.record(performance.now() - start, { method });
    return result;
  }
}
