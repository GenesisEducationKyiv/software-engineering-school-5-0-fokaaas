import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionClientInterface } from './interfaces/subscription-client.interface';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SubscriptionDiTokens } from './constants/di-tokens.const';
import {
  FindByFrequencyListResponse,
  FrequencyRequest,
  SubscriptionServiceInterface,
} from '@shared-types/grpc/subscription';
import { GrpcToObservable } from '@shared-types/grpc/common';

@Injectable()
export class SubscriptionClient implements SubscriptionClientInterface {
  private clientService: GrpcToObservable<SubscriptionServiceInterface>;

  constructor(
    @Inject(SubscriptionDiTokens.SUBSCRIPTION_PACKAGE)
    private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.clientService = this.client.getService<
      GrpcToObservable<SubscriptionServiceInterface>
    >('SubscriptionService');
  }

  async findByFrequency(
    request: FrequencyRequest
  ): Promise<FindByFrequencyListResponse> {
    return firstValueFrom(this.clientService.findByFrequency(request));
  }
}
