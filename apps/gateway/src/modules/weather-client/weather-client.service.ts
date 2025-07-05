import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type {
  CityExistsRequest,
  CityExistsResponse,
  GetWeatherRequest,
  GetWeatherResponse,
  GrpcToObservable,
  IWeatherService,
} from '@types';
import type { ClientGrpc } from '@nestjs/microservices';
import { WeatherClientDiTokens } from './constants/di-tokens.const';
import { ClientGetWeather } from '../weather/weather.service';
import { ClientWeatherCityExists } from '../subscription/subscription.service';

@Injectable()
export class WeatherClientService
  implements ClientGetWeather, ClientWeatherCityExists, OnModuleInit
{
  private clientService: GrpcToObservable<IWeatherService>;

  constructor(
    @Inject(WeatherClientDiTokens.WEATHER_PACKAGE)
    private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.clientService =
      this.client.getService<GrpcToObservable<IWeatherService>>(
        'WeatherService'
      );
  }

  async cityExists(request: CityExistsRequest): Promise<CityExistsResponse> {
    return this.clientService.cityExists(request).toPromise();
  }

  async get(request: GetWeatherRequest): Promise<GetWeatherResponse> {
    return this.clientService.get(request).toPromise();
  }
}
