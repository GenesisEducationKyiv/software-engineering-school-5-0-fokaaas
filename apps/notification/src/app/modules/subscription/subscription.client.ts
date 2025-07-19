import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionClientInterface } from './interfaces/subscription-client.interface';
import {
  FindByFrequencyListResponse,
  FrequencyRequest,
  GrpcToObservable,
  ISubscriptionService,
} from '@types';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SubscriptionDiTokens } from './constants/di-tokens.const';

@Injectable()
export class SubscriptionClient implements SubscriptionClientInterface {
  private clientService: GrpcToObservable<ISubscriptionService>;

  constructor(
    @Inject(SubscriptionDiTokens.SUBSCRIPTION_PACKAGE)
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
    return firstValueFrom(this.clientService.findByFrequency(request));
  }
}
