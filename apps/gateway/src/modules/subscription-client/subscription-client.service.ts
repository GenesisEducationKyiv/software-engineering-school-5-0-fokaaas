import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type {
  CreateRequest,
  FindByFrequencyListResponse,
  FrequencyRequest,
  ISubscriptionService,
  TokenRequest,
  TokenResponse,
  GrpcToObservable,
  Empty,
} from '@types';
import type { ClientGrpc } from '@nestjs/microservices';
import { SubscriptionClientDiTokens } from './constants/di-tokens.const';
import { ManageSubscriptionInterface } from './interfaces/manage-subscription.interface';
import { FindSubscriptionsInterface } from './interfaces/find-subscriptions.interface';

@Injectable()
export class SubscriptionClientService
  implements
    ManageSubscriptionInterface,
    FindSubscriptionsInterface,
    OnModuleInit
{
  private clientService: GrpcToObservable<ISubscriptionService>;

  constructor(
    @Inject(SubscriptionClientDiTokens.SUBSCRIPTION_PACKAGE)
    private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.clientService = this.client.getService<
      GrpcToObservable<ISubscriptionService>
    >('SubscriptionService');
  }

  async findByFrequency(
    request: FrequencyRequest
  ): Promise<FindByFrequencyListResponse> {
    return this.clientService.findByFrequency(request).toPromise();
  }

  async create(request: CreateRequest): Promise<TokenResponse> {
    return this.clientService.create(request).toPromise();
  }

  async confirm(request: TokenRequest): Promise<Empty> {
    return this.clientService.confirm(request).toPromise();
  }

  async unsubscribe(request: TokenRequest): Promise<Empty> {
    return this.clientService.unsubscribe(request).toPromise();
  }
}
