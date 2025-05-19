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
      .then(items => items.map(item => ({
        email: item.email,
        city: item.city,
        token: item.token
      })));
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
    const fromRedis = await this.redis.exists(request.token);
    const fromDb = await this.repo
      .find({ token: request.token })
      .then(items => items.length > 0);
    return { exists: fromRedis || fromDb };
  }

  async confirm(request: TokenRequest): Promise<MessageResponse> {
    const data = await this.redis.getObj<CreateRequest>(request.token);
    await this.repo.create({
      email: data.email,
      frequency: data.frequency as Frequency,
      city: data.city,
      token: request.token,
    });
    await this.redis.delete(request.token);
    return { message: 'Subscription confirmed successfully' };
  }

  async unsubscribe(request: TokenRequest): Promise<MessageResponse> {
    await this.repo.deleteByToken(request.token);
    return { message: 'Unsubscribed successfully' };
  }
}
