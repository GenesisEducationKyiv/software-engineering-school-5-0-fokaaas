import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@utils';
import { randomUUID } from 'node:crypto';
import { GrpcAlreadyExistsException } from '../../common/exceptions/grpc-already-exists.exception';
import { GrpcNotFoundException } from '../../common/exceptions/grpc-not-found.exception';
import { SubscriptionDiTokens } from './constants/di-tokens.const';
import { Frequency, Subscription } from '@prisma/client';
import { SubscriptionData } from './data/subscription.data';
import { SubscriptionServiceInterface } from './interfaces/subscription-service.interface';
import type { SubscriptionRepositoryInterface } from './interfaces/subscription-repository.interface';

@Injectable()
export class SubscriptionService implements SubscriptionServiceInterface {
  constructor(
    @Inject(SubscriptionDiTokens.SUBSCRIPTION_REPOSITORY)
    private readonly repo: SubscriptionRepositoryInterface,

    private readonly redis: RedisService
  ) {}

  findByFrequency(frequency: Frequency): Promise<Subscription[]> {
    return this.repo.find({ frequency });
  }

  private async emailExists(email: string): Promise<boolean> {
    const emails = await this.repo.find({ email });
    return emails.length > 0;
  }

  private async tokenExists(token: string): Promise<boolean> {
    const items = await this.repo.find({ token });
    return items.length > 0;
  }

  async create(data: SubscriptionData): Promise<string> {
    const emailExists = await this.emailExists(data.email);
    if (emailExists) {
      throw new GrpcAlreadyExistsException('Email');
    }
    const token = randomUUID();
    await this.redis.setObj<SubscriptionData>(token, data);
    return token;
  }

  async confirm(token: string): Promise<void> {
    const data = await this.redis.getObj<SubscriptionData>(token);
    if (!data) {
      throw new GrpcNotFoundException('Token');
    }
    await this.repo.create({
      email: data.email,
      frequency: data.frequency,
      city: data.city,
      token: token,
    });
    await this.redis.delete(token);
  }

  async unsubscribe(token: string): Promise<void> {
    const exists = await this.tokenExists(token);
    if (!exists) {
      throw new GrpcNotFoundException('Token');
    }
    await this.repo.deleteByToken(token);
  }
}
