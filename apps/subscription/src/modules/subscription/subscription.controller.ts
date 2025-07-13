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
import { SubscriptionDiTokens } from './constants/di-tokens.const';
import { Inject } from '@nestjs/common';
import type { SubscriptionServiceInterface } from './interfaces/subscription-service.interface';
import type { SubscriptionMapperInterface } from './interfaces/subscription-mapper.interface';

@GrpcService()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @Inject(SubscriptionDiTokens.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: SubscriptionServiceInterface,

    @Inject(SubscriptionDiTokens.SUBSCRIPTION_MAPPER)
    private readonly mapper: SubscriptionMapperInterface
  ) {}

  @GrpcMethod('SubscriptionService', 'FindByFrequency')
  async findByFrequency(
    request: FrequencyRequest
  ): Promise<FindByFrequencyListResponse> {
    const subscriptions = await this.subscriptionService.findByFrequency(
      request.frequency
    );
    return this.mapper.mapToSubscriptionsDto(subscriptions);
  }

  @GrpcMethod('SubscriptionService', 'Create')
  async create(request: CreateRequest): Promise<TokenResponse> {
    const token = await this.subscriptionService.create(request);
    return { token };
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
