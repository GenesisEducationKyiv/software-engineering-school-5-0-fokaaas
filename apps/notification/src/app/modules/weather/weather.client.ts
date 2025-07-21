import { Inject, Injectable } from '@nestjs/common';
import { WeatherClientInterface } from './interfaces/weather-client.interface';
import {
  GetWeatherRequest,
  GetWeatherResponse,
  WeatherServiceInterface,
} from '@shared-types/grpc/weather';
import type { ClientGrpc } from '@nestjs/microservices';
import { WeatherDiTokens } from './constants/di-tokens.const';
import { firstValueFrom } from 'rxjs';
import { GrpcToObservable } from '@shared-types/grpc/common';

@Injectable()
export class WeatherClient implements WeatherClientInterface {
  private clientService: GrpcToObservable<WeatherServiceInterface>;

  constructor(
    @Inject(WeatherDiTokens.WEATHER_PACKAGE)
    private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.clientService =
      this.client.getService<GrpcToObservable<WeatherServiceInterface>>(
        'WeatherService'
      );
  }

  async get(request: GetWeatherRequest): Promise<GetWeatherResponse> {
    return firstValueFrom(this.clientService.get(request));
  }
}
