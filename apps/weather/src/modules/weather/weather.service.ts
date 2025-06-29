import { Injectable } from '@nestjs/common';
import type {
  CityExistsRequest,
  CityExistsResponse,
  GetWeatherRequest,
  GetWeatherResponse,
  IWeatherService,
} from '@types';
import { RpcException } from '@nestjs/microservices';
import { RpcUnavailableException } from '../../common/exceptions/rpc-unavailable-exception';

export interface IWeatherProvider {
  cityExists(city: string): Promise<boolean>;
  get(city: string): Promise<GetWeatherResponse>;
}

@Injectable()
export class WeatherService implements IWeatherService {
  constructor(private readonly chain: IWeatherProvider[]) {}

  async get({ city }: GetWeatherRequest): Promise<GetWeatherResponse> {
    return this.tryChain((provider) => provider.get(city));
  }

  async cityExists({ city }: CityExistsRequest): Promise<CityExistsResponse> {
    const exists = await this.tryChain((provider) => provider.cityExists(city));
    return { exists };
  }

  private async tryChain<T>(
    handler: (provider: IWeatherProvider) => Promise<T>
  ): Promise<T> {
    for (const provider of this.chain) {
      try {
        return await handler(provider);
      } catch (error) {
        if (
          error instanceof RpcException &&
          !(error instanceof RpcUnavailableException)
        ) {
          throw error;
        }
      }
    }
    throw new RpcUnavailableException();
  }
}
