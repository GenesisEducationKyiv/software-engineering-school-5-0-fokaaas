import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type {
  CityExistsRequest,
  CityExistsResponse,
  GetWeatherRequest,
  GetWeatherResponse,
  WeatherServiceInterface,
} from '@shared-types/grpc/weather';
import type { ClientGrpc } from '@nestjs/microservices';
import { WeatherClientDiTokens } from './constants/di-tokens.const';
import { GetWeatherInterface } from './interfaces/get-weather.interface';
import { WeatherCityExistsInterface } from './interfaces/city-exists.interface';
import { GrpcToObservable } from '@shared-types/grpc/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherClientService
  implements GetWeatherInterface, WeatherCityExistsInterface, OnModuleInit
{
  private clientService: GrpcToObservable<WeatherServiceInterface>;

  constructor(
    @Inject(WeatherClientDiTokens.WEATHER_PACKAGE)
    private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.clientService =
      this.client.getService<GrpcToObservable<WeatherServiceInterface>>(
        'WeatherService'
      );
  }

  cityExists(request: CityExistsRequest): Promise<CityExistsResponse> {
    return firstValueFrom(this.clientService.cityExists(request));
  }

  get(request: GetWeatherRequest): Promise<GetWeatherResponse> {
    return firstValueFrom(this.clientService.get(request));
  }
}
