import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import type {
  EmailControllerInterface,
  SendConfirmationRequest,
} from '@shared-types/grpc/email';
import { Inject } from '@nestjs/common';
import { EmailDiTokens } from './constants/di-tokens.const';
import type { EmailServiceInterface } from './interfaces/email-service.interface';
import { Empty } from '@shared-types/grpc/common';

@GrpcService()
export class EmailController implements EmailControllerInterface {
  constructor(
    @Inject(EmailDiTokens.EMAIL_SERVICE)
    private readonly service: EmailServiceInterface
  ) {}

  @GrpcMethod('EmailService', 'SendConfirmation')
  async sendConfirmation(request: SendConfirmationRequest): Promise<Empty> {
    await this.service.sendConfirmation(request);
    return {};
  }
}
