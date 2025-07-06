import { RedisService } from '@utils';
import { IWeatherService } from '../weather.controller';
import { WeatherDto } from '../dto/weather.dto';
import { ExistsDto } from '../dto/exists.dto';
import { IMetricsService } from '../factories/weather-service.factory';

export class WeatherCacheProxy implements IWeatherService {
  constructor(
    private readonly service: IWeatherService,
    private readonly redis: RedisService,
    private readonly metrics: IMetricsService
  ) {}

  async get(city: string): Promise<WeatherDto> {
    using timer = this.metrics.createResponseTimer('get');

    const key = city.toLowerCase();
    const cache = await this.redis.getObj<WeatherDto>(key);
    if (cache) {
      this.metrics.incCacheHit('get');
      return cache;
    }

    this.metrics.incCacheMiss('get');

    const result = await this.service.get(city);
    await this.redis.setObj(key, result);
    return result;
  }

  async cityExists(city: string): Promise<ExistsDto> {
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
