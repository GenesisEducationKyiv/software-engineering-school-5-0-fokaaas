import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import type {
  CreateRequest,
  EmailRequest,
  ExistsResponse,
  FindByFrequencyListResponse,
  FrequencyRequest,
  ISubscriptionController,
  MessageResponse,
  TokenRequest,
  TokenResponse,
} from '@weather-api/interfaces';
import { SubscriptionService } from './subscription.service';

@GrpcService()
export class SubscriptionController implements ISubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @GrpcMethod('SubscriptionService', 'FindByFrequency')
  findByFrequency(request: FrequencyRequest): Promise<FindByFrequencyListResponse> {
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
  confirm(request: TokenRequest): Promise<MessageResponse> {
    return this.subscriptionService.confirm(request);
  }

  @GrpcMethod('SubscriptionService', 'Unsubscribe')
  unsubscribe(request: TokenRequest): Promise<MessageResponse> {
    return this.subscriptionService.unsubscribe(request);
  }
}
