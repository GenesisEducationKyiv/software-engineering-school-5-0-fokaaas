import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type {
  CreateRequest,
  SubscriptionServiceInterface,
  TokenRequest,
  TokenResponse,
} from '@shared-types/grpc/subscription';
import type { ClientGrpc } from '@nestjs/microservices';
import { SubscriptionClientDiTokens } from './constants/di-tokens.const';
import { ManageSubscriptionInterface } from './interfaces/manage-subscription.interface';
import { Empty, GrpcToObservable } from '@shared-types/grpc/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SubscriptionClientService
  implements ManageSubscriptionInterface, OnModuleInit
{
  private clientService: GrpcToObservable<SubscriptionServiceInterface>;

  constructor(
    @Inject(SubscriptionClientDiTokens.SUBSCRIPTION_PACKAGE)
    private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.clientService = this.client.getService<
      GrpcToObservable<SubscriptionServiceInterface>
    >('SubscriptionService');
  }

  create(request: CreateRequest): Promise<TokenResponse> {
    return firstValueFrom(this.clientService.create(request));
  }

  confirm(request: TokenRequest): Promise<Empty> {
    return firstValueFrom(this.clientService.confirm(request));
  }

  async unsubscribe(request: TokenRequest): Promise<Empty> {
    return firstValueFrom(this.clientService.unsubscribe(request));
  }
}
