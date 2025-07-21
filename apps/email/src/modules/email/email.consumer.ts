import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { SendForecastData } from '@shared-types/rmq/email';
import { EmailDiTokens } from './constants/di-tokens.const';
import type { EmailServiceInterface } from './interfaces/email-service.interface';

@Controller()
export class EmailConsumer {
  constructor(
    @Inject(EmailDiTokens.EMAIL_SERVICE)
    private readonly service: EmailServiceInterface
  ) {}

  @EventPattern('forecast_email')
  async handleForecastEmail(@Payload() payload: SendForecastData) {
    await this.service.sendForecast(payload);
  }
}
