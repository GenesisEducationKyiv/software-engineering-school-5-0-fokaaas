import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type {
  Empty,
  IEmailService,
  SendConfirmationRequest,
  SendForecastRequest,
  GrpcToObservable,
} from '@types';
import type { ClientGrpc } from '@nestjs/microservices';
import { EmailClientDiTokens } from './constants/di-tokens.const';
import { ClientSendConfirmationEmail } from '../subscription/subscription.service';
import { ClientSendForecast } from '../weather/weather.service';

@Injectable()
export class EmailClientService
  implements ClientSendConfirmationEmail, ClientSendForecast, OnModuleInit
{
  private clientService: GrpcToObservable<IEmailService>;

  constructor(
    @Inject(EmailClientDiTokens.EMAIL_PACKAGE)
    private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.clientService =
      this.client.getService<GrpcToObservable<IEmailService>>('EmailService');
  }

  async sendConfirmation(request: SendConfirmationRequest): Promise<Empty> {
    return this.clientService.sendConfirmation(request).toPromise();
  }

  async sendForecast(request: SendForecastRequest): Promise<Empty> {
    return this.clientService.sendForecast(request).toPromise();
  }
}
