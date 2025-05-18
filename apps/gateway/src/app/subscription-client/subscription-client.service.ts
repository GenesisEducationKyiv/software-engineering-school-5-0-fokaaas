import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateRequest,
  EmailRequest,
  ExistsResponse,
  FindByFrequencyListResponse,
  FrequencyRequest,
  ISubscriptionService,
  MessageResponse,
  TokenRequest,
  TokenResponse,
  GrpcToObservable
} from '@weather-api/interfaces';
import type { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class SubscriptionClientService
  implements ISubscriptionService, OnModuleInit
{
  private clientService: GrpcToObservable<ISubscriptionService>;

  constructor(@Inject('SUBSCRIPTION_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.clientService = this.client.getService<GrpcToObservable<ISubscriptionService>>(
      'SubscriptionService'
    );
  }

  async findByFrequency(request: FrequencyRequest): Promise<FindByFrequencyListResponse> {
    return this.clientService.findByFrequency(request).toPromise();
  }

  async emailExists(request: EmailRequest): Promise<ExistsResponse> {
    return this.clientService.emailExists(request).toPromise();
  }

  async create(request: CreateRequest): Promise<TokenResponse> {
    return this.clientService.create(request).toPromise();
  }

  async tokenExists(request: TokenRequest): Promise<ExistsResponse> {
    return this.clientService.tokenExists(request).toPromise();
  }

  async confirm(request: TokenRequest): Promise<MessageResponse> {
    return this.clientService.confirm(request).toPromise();
  }

  async unsubscribe(request: EmailRequest): Promise<MessageResponse> {
    return this.clientService.unsubscribe(request).toPromise();
  }
}
