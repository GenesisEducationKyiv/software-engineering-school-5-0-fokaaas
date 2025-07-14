import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcUnavailableException } from '../../common/exceptions/rpc-unavailable-exception';
import { WeatherServiceInterface } from './interfaces/weather-service.interface';
import { WeatherProviderInterface } from './interfaces/weather-provider.interface';
import { WeatherData } from './data/weather.data';
import { ExistsData } from './data/exists.data';

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  constructor(private readonly chain: WeatherProviderInterface[]) {}

  async get(city: string): Promise<WeatherData> {
    return this.tryChain((provider) => provider.get(city));
  }

  async cityExists(city: string): Promise<ExistsData> {
    const exists = await this.tryChain((provider) => provider.cityExists(city));
    return { exists };
  }

  private async tryChain<T>(
    handler: (provider: WeatherProviderInterface) => Promise<T>
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
