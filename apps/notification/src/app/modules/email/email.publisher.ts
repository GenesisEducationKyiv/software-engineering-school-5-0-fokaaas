import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { SendForecastData } from '@shared-types/rmq/email';
import { EmailDiTokens } from './constants/di-tokens.const';
import { EmailPublisherInterface } from './interfaces/email-publisher.interface';

@Injectable()
export class EmailPublisher implements EmailPublisherInterface {
  constructor(
    @Inject(EmailDiTokens.EMAIL_SERVICE)
    private readonly client: ClientRMQ
  ) {}

  pubForecastEmail(data: SendForecastData) {
    this.client.emit('forecast_email', data);
  }
}
