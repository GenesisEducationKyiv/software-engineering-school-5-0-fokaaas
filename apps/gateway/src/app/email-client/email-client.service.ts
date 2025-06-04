import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type {
  Empty,
  IEmailService,
  SendConfirmationRequest,
  SendForecastRequest,
  GrpcToObservable,
} from '@types';
import type { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class EmailClientService implements IEmailService, OnModuleInit {
  private clientService: GrpcToObservable<IEmailService>;

  constructor (@Inject('EMAIL_PACKAGE') private client: ClientGrpc) {}

  onModuleInit () {
    this.clientService =
      this.client.getService<GrpcToObservable<IEmailService>>('EmailService');
  }

  async sendConfirmation (request: SendConfirmationRequest): Promise<Empty> {
    return this.clientService.sendConfirmation(request).toPromise();
  }

  async sendForecast (request: SendForecastRequest): Promise<Empty> {
    return this.clientService.sendForecast(request).toPromise();
  }
}
