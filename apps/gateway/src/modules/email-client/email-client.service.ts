import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { EmailClientDiTokens } from './constants/di-tokens.const';
import { SendConfirmationInterface } from './interfaces/send-confirmation.interface';
import { Empty, GrpcToObservable } from '@shared-types/grpc/common';
import {
  EmailServiceInterface,
  SendConfirmationRequest,
} from '@shared-types/grpc/email';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmailClientService
  implements SendConfirmationInterface, OnModuleInit
{
  private clientService: GrpcToObservable<EmailServiceInterface>;

  constructor(
    @Inject(EmailClientDiTokens.EMAIL_PACKAGE)
    private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.clientService =
      this.client.getService<GrpcToObservable<EmailServiceInterface>>(
        'EmailService'
      );
  }

  sendConfirmation(request: SendConfirmationRequest): Promise<Empty> {
    return firstValueFrom(this.clientService.sendConfirmation(request));
  }
}
