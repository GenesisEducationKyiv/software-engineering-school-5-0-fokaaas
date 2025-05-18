import { Injectable } from '@nestjs/common';
import { Frequency } from '@prisma/client';
import { SubscriptionRepository } from './subscription.repository';
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
} from '@weather-api/interfaces';
import { RedisService } from '../redis/redis.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    private readonly repo: SubscriptionRepository,
    private readonly redis: RedisService,
  ) {}

  async findByFrequency(request: FrequencyRequest): Promise<FindByFrequencyListResponse> {
    const subscriptions = await this.repo
      .find({ frequency: request.frequency as Frequency, })
      .then(items => items.map(item => ({ email: item.email, city: item.city })));
    return { subscriptions };
  }

  async emailExists(request: EmailRequest): Promise<ExistsResponse> {
    return this.repo
      .find({ email: request.email })
      .then(items => ({ exists: items.length > 0 }));
  }

  async create(request: CreateRequest): Promise<TokenResponse> {
    const token = randomUUID();
    await this.redis.setObj<CreateRequest>(token, request);
    return { token };
  }

  async tokenExists(request: TokenRequest): Promise<ExistsResponse> {
    const exists = await this.redis.exists(request.token);
    return { exists }
  }

  async confirm(request: TokenRequest): Promise<MessageResponse> {
    const data = await this.redis.getObj<CreateRequest>(request.token);
    await this.repo.create({
      email: data.email,
      frequency: data.frequency as Frequency,
      city: data.city,
    });
    await this.redis.delete(request.token);
    return { message: 'Subscription confirmed successfully' };
  }

  async unsubscribe(request: EmailRequest): Promise<MessageResponse> {
    await this.repo.deleteByEmail(request.email);
    return { message: 'Unsubscribed successfully' };
  }
}
