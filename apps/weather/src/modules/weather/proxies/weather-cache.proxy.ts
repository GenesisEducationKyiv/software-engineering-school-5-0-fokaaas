import { RedisService } from '@utils';
import { WeatherServiceInterface } from '../interfaces/weather-service.interface';
import { WeatherData } from '../data/weather.data';
import { ExistsData } from '../data/exists.data';
import { MetricsServiceInterface } from '../../metrics/interfaces/metrics-service.interface';

export class WeatherCacheProxy implements WeatherServiceInterface {
  constructor(
    private readonly service: WeatherServiceInterface,
    private readonly redis: RedisService,
    private readonly metrics: MetricsServiceInterface
  ) {}

  async get(city: string): Promise<WeatherData> {
    using timer = this.metrics.createResponseTimer('get');

    const key = city.toLowerCase();
    const cache = await this.redis.getObj<WeatherData>(key);
    if (cache) {
      this.metrics.incCacheHit('get');
      return cache;
    }

    this.metrics.incCacheMiss('get');

    const result = await this.service.get(city);
    await this.redis.setObj(key, result);
    return result;
  }

  async cityExists(city: string): Promise<ExistsData> {
    using timer = this.metrics.createResponseTimer('cityExists');

    const key = `exists:${city.toLowerCase()}`;
    const cache = await this.redis.getBool(key);
    if (cache) {
      this.metrics.incCacheHit('cityExists');
      return { exists: cache };
    }

    this.metrics.incCacheMiss('cityExists');

    const result = await this.service.cityExists(city);
    await this.redis.setBool(key, result.exists);
    return result;
  }
}
