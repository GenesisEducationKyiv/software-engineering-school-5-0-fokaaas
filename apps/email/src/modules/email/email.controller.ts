import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import type {
  Empty,
  IEmailController,
  SendConfirmationRequest,
  SendForecastRequest,
} from '@types';
import { Inject } from '@nestjs/common';
import { EmailDiTokens } from './constants/di-tokens.const';
import type { EmailServiceInterface } from './interfaces/email-service.interface';

@GrpcService()
export class EmailController implements IEmailController {
  constructor(
    @Inject(EmailDiTokens.EMAIL_SERVICE)
    private readonly service: EmailServiceInterface
  ) {}

  @GrpcMethod('EmailService', 'SendConfirmation')
  async sendConfirmation(request: SendConfirmationRequest): Promise<Empty> {
    await this.service.sendConfirmation(request);
    return {};
  }

  @GrpcMethod('EmailService', 'SendForecast')
  async sendForecast(request: SendForecastRequest): Promise<Empty> {
    await this.service.sendForecast(request);
    return {};
  }
}
