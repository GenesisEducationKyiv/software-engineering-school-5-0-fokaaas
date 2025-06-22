import { IWeatherProvider } from '../weather.service';
import type { GetWeatherResponse } from '@types';
import { RpcUnavailableException } from '../../../common/exceptions/rpc-unavailable-exception';

export abstract class WeatherProvider implements IWeatherProvider {
  protected nextProvider?: IWeatherProvider;
  protected baseUrl: string;

  setNext(provider: IWeatherProvider): IWeatherProvider {
    this.nextProvider = provider;
    return provider;
  }

  cityExists(city: string): Promise<boolean> {
    if (this.nextProvider) {
      return this.nextProvider.cityExists(city);
    }
    throw new RpcUnavailableException();
  }

  get(city: string): Promise<GetWeatherResponse> {
    if (this.nextProvider) {
      return this.nextProvider.get(city);
    }
    throw new RpcUnavailableException();
  }
}
