import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import { EmailService } from './email.service';
import type {
  Empty,
  IEmailController,
  SendConfirmationRequest,
  SendForecastRequest,
} from '@types';

@GrpcService()
export class EmailController implements IEmailController {
  constructor (private readonly service: EmailService) {}

  @GrpcMethod('EmailService', 'SendConfirmation')
  sendConfirmation (request: SendConfirmationRequest): Promise<Empty> {
    return this.service.sendConfirmation(request);
  }

  @GrpcMethod('EmailService', 'SendForecast')
  sendForecast (request: SendForecastRequest): Promise<Empty> {
    return this.service.sendForecast(request);
  }
}
