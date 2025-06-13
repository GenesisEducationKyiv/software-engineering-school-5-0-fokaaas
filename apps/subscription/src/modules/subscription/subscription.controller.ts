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
import { SubscriptionService } from './subscription.service';

@GrpcService()
export class SubscriptionController implements ISubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @GrpcMethod('SubscriptionService', 'FindByFrequency')
  findByFrequency(
    request: FrequencyRequest
  ): Promise<FindByFrequencyListResponse> {
    return this.subscriptionService.findByFrequency(request);
  }

  @GrpcMethod('SubscriptionService', 'Create')
  create(request: CreateRequest): Promise<TokenResponse> {
    return this.subscriptionService.create(request);
  }

  @GrpcMethod('SubscriptionService', 'Confirm')
  confirm(request: TokenRequest): Promise<Empty> {
    return this.subscriptionService.confirm(request);
  }

  @GrpcMethod('SubscriptionService', 'Unsubscribe')
  unsubscribe(request: TokenRequest): Promise<Empty> {
    return this.subscriptionService.unsubscribe(request);
  }
}
