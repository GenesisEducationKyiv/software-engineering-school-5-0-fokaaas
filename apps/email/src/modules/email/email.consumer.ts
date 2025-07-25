import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { SendForecastData } from '@shared-types/rmq/email';
import { EmailDiTokens } from './constants/di-tokens.const';
import type { EmailServiceInterface } from './interfaces/email-service.interface';
import { RetryInterceptor } from './interceptor/retry.interceptor';
import { EmailPatterns } from '@shared/common/constants/email-patterns.const';

@Controller()
export class EmailConsumer {
  constructor(
    @Inject(EmailDiTokens.EMAIL_SERVICE)
    private readonly service: EmailServiceInterface
  ) {}

  @EventPattern(EmailPatterns.FORECAST_EMAIL)
  @UseInterceptors(new RetryInterceptor())
  async handleForecastEmail(@Payload() payload: SendForecastData) {
    await this.service.sendForecast(payload);
  }
}
