import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import type {
  Empty,
  IEmailController,
  SendConfirmationRequest,
  SendForecastRequest,
} from '@types';
import { ConfirmationDto } from '../dto/confirmation.dto';
import { ForecastDto } from '../dto/forecast.dto';
import { Inject } from '@nestjs/common';
import { EmailDiTokens } from '../constants/di-tokens.const';

export interface IEmailService {
  sendConfirmation(dto: ConfirmationDto): Promise<void>;
  sendForecast(dto: ForecastDto): Promise<void>;
}

@GrpcService()
export class EmailController implements IEmailController {
  constructor(
    @Inject(EmailDiTokens.EMAIL_SERVICE)
    private readonly service: IEmailService
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
