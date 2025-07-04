import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import type {
  CreateRequest,
  Empty,
  FindByFrequencyListResponse,
  FrequencyRequest,
  ISubscriptionController,
  TokenRequest,
  TokenResponse,
} from '@types';
import { SubscriptionDiTokens } from './constants/di-tokens';
import { Inject } from '@nestjs/common';
import { Frequency } from '@prisma/client';
import { SubscriptionDto } from './dto/subscription.dto';
import { TokenDto } from './dto/token.dto';
import { SubscriptionsDto } from './dto/subscriptions.dto';

export interface ISubscriptionService {
  findByFrequency(frequency: Frequency): Promise<SubscriptionsDto>;
  create(dto: SubscriptionDto): Promise<TokenDto>;
  confirm(token: string): Promise<void>;
  unsubscribe(token: string): Promise<void>;
}

@GrpcService()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @Inject(SubscriptionDiTokens.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService
  ) {}

  @GrpcMethod('SubscriptionService', 'FindByFrequency')
  findByFrequency(
    request: FrequencyRequest
  ): Promise<FindByFrequencyListResponse> {
    return this.subscriptionService.findByFrequency(request.frequency);
  }

  @GrpcMethod('SubscriptionService', 'Create')
  create(request: CreateRequest): Promise<TokenResponse> {
    return this.subscriptionService.create(request);
  }

  @GrpcMethod('SubscriptionService', 'Confirm')
  async confirm(request: TokenRequest): Promise<Empty> {
    await this.subscriptionService.confirm(request.token);
    return {};
  }

  @GrpcMethod('SubscriptionService', 'Unsubscribe')
  async unsubscribe(request: TokenRequest): Promise<Empty> {
    await this.subscriptionService.unsubscribe(request.token);
    return {};
  }
}
