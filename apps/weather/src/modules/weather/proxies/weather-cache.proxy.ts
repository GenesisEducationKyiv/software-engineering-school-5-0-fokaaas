import { WeatherData } from '../data/weather.data';
import { ExistsData } from '../data/exists.data';
import { WeatherServiceInterface } from '../interfaces/weather-service.interface';
import { RedisService } from '@shared/modules/redis/redis.service';
import { MetricsServiceInterface } from '../../metrics/interfaces/metrics-service.interface';

export class WeatherCacheProxy implements WeatherServiceInterface {
  constructor(
    private readonly service: WeatherServiceInterface,
    private readonly redis: RedisService,
    private readonly metricsService: MetricsServiceInterface
  ) {}

  async get(city: string): Promise<WeatherData> {
    const method = 'get';
    using timer = this.metricsService.measureResponseTime(method);

    const key = city.toLowerCase();
    const cache = await this.redis.getObj<WeatherData>(key);
    if (cache) {
      this.metricsService.incCacheHit(method);
      return cache;
    }

    this.metricsService.incCacheMiss(method);
    const result = await this.service.get(city);
    await this.redis.setObj(key, result);
    return result;
  }

  async cityExists(city: string): Promise<ExistsData> {
    const method = 'cityExists';
    using timer = this.metricsService.measureResponseTime(method);

    const key = `exists:${city.toLowerCase()}`;
    const cache = await this.redis.getBool(key);
    if (cache) {
      this.metricsService.incCacheHit(method);
      return { exists: cache };
    }

    this.metricsService.incCacheMiss(method);
    const result = await this.service.cityExists(city);
    await this.redis.setBool(key, result.exists);
    return result;
  }
}
