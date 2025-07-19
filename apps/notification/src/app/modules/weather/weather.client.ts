import { Inject, Injectable } from '@nestjs/common';
import { WeatherClientInterface } from './interfaces/weather-client.interface';
import {
  GetWeatherRequest,
  GetWeatherResponse,
  GrpcToObservable,
  IWeatherService,
} from '@types';
import type { ClientGrpc } from '@nestjs/microservices';
import { WeatherDiTokens } from './constants/di-tokens.const';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherClient implements WeatherClientInterface {
  private clientService: GrpcToObservable<IWeatherService>;

  constructor(
    @Inject(WeatherDiTokens.WEATHER_PACKAGE)
    private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.clientService =
      this.client.getService<GrpcToObservable<IWeatherService>>(
        'WeatherService'
      );
  }

  async get(request: GetWeatherRequest): Promise<GetWeatherResponse> {
    return firstValueFrom(this.clientService.get(request));
  }
}
