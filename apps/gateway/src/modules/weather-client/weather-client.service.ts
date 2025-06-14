import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type {
  CityExistsRequest,
  CityExistsResponse,
  GetRequest,
  GetResponse,
  GrpcToObservable,
  IWeatherService,
} from '@types';
import type { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class WeatherClientService implements IWeatherService, OnModuleInit {
  private clientService: GrpcToObservable<IWeatherService>;

  constructor(@Inject('WEATHER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.clientService =
      this.client.getService<GrpcToObservable<IWeatherService>>(
        'WeatherService'
      );
  }

  async cityExists(request: CityExistsRequest): Promise<CityExistsResponse> {
    return this.clientService.cityExists(request).toPromise();
  }

  async get(request: GetRequest): Promise<GetResponse> {
    return this.clientService.get(request).toPromise();
  }
}
