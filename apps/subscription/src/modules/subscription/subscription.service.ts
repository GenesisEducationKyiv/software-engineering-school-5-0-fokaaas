import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from './subscription.repository';
import type {
  CreateRequest,
  Empty,
  FindByFrequencyListResponse,
  FrequencyRequest,
  ISubscriptionService,
  TokenRequest,
  TokenResponse,
} from '@types';
import { RedisService } from '../../database/redis/redis.service';
import { randomUUID } from 'node:crypto';
import { GrpcAlreadyExistsException } from '../../common/exceptions/grpc-already-exists.exception';
import { GrpcNotFoundException } from '../../common/exceptions/grpc-not-found.exception';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    private readonly repo: SubscriptionRepository,
    private readonly redis: RedisService
  ) {}

  async findByFrequency(
    request: FrequencyRequest
  ): Promise<FindByFrequencyListResponse> {
    const subscriptions = await this.repo
      .find({ frequency: request.frequency })
      .then((items) =>
        items.map((item) => ({
          email: item.email,
          city: item.city,
          token: item.token,
        }))
      );
    return { subscriptions };
  }

  private async emailExists(email: string): Promise<boolean> {
    const emails = await this.repo.find({ email });
    return emails.length > 0;
  }

  private async tokenExists(token: string): Promise<boolean> {
    const items = await this.repo.find({ token });
    return items.length > 0;
  }

  async create(request: CreateRequest): Promise<TokenResponse> {
    const emailExists = await this.emailExists(request.email);
    if (emailExists) {
      throw new GrpcAlreadyExistsException('Email');
    }
    const token = randomUUID();
    await this.redis.setObj<CreateRequest>(token, request);
    return { token };
  }

  async confirm(request: TokenRequest): Promise<Empty> {
    const exists = await this.redis.exists(request.token);
    if (!exists) {
      throw new GrpcNotFoundException('Token');
    }
    const data = await this.redis.getObj<CreateRequest>(request.token);
    await this.repo.create({
      email: data.email,
      frequency: data.frequency,
      city: data.city,
      token: request.token,
    });
    await this.redis.delete(request.token);
    return {};
  }

  async unsubscribe({ token }: TokenRequest): Promise<Empty> {
    const exists = await this.tokenExists(token);
    if (!exists) {
      throw new GrpcNotFoundException('Token');
    }
    await this.repo.deleteByToken(token);
    return {};
  }
}
