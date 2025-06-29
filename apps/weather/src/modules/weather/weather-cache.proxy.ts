import {
  CityExistsRequest,
  CityExistsResponse,
  GetWeatherRequest,
  GetWeatherResponse,
  IWeatherService,
} from '@types';
import { RedisService } from '@utils';

export class WeatherCacheProxy implements IWeatherService {
  constructor(
    private readonly service: IWeatherService,
    private readonly redis: RedisService
  ) {}

  async get({ city }: GetWeatherRequest): Promise<GetWeatherResponse> {
    const key = city.toLowerCase();
    const cache = await this.redis.getObj<GetWeatherResponse>(key);
    if (cache) return cache;

    const result = await this.service.get({ city });
    await this.redis.setObj(key, result);
    return result;
  }

  async cityExists({ city }: CityExistsRequest): Promise<CityExistsResponse> {
    const key = `exists:${city.toLowerCase()}`;
    const cache = await this.redis.getBool(key);
    if (cache) return { exists: cache };

    const result = await this.service.cityExists({ city });
    await this.redis.setBool(key, result.exists);
    return result;
  }
}
