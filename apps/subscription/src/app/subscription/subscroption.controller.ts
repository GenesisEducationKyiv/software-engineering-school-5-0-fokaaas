import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import type {
  CreateRequest,
  EmailRequest, Empty,
  ExistsResponse,
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

  @GrpcMethod('SubscriptionService', 'EmailExists')
  emailExists(request: EmailRequest): Promise<ExistsResponse> {
    return this.subscriptionService.emailExists(request);
  }

  @GrpcMethod('SubscriptionService', 'Create')
  create(request: CreateRequest): Promise<TokenResponse> {
    return this.subscriptionService.create(request);
  }

  @GrpcMethod('SubscriptionService', 'TokenExists')
  tokenExists(request: TokenRequest): Promise<ExistsResponse> {
    return this.subscriptionService.tokenExists(request);
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
