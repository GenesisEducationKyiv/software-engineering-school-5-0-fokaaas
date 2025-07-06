import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@utils';
import { randomUUID } from 'node:crypto';
import { GrpcAlreadyExistsException } from '../../common/exceptions/grpc-already-exists.exception';
import { GrpcNotFoundException } from '../../common/exceptions/grpc-not-found.exception';
import { SubscriptionDiTokens } from './constants/di-tokens.const';
import { SubscriptionsDto } from './dto/subscriptions.dto';
import { Frequency, Prisma, Subscription } from '@prisma/client';
import { ISubscriptionService } from './subscription.controller';
import { SubscriptionDto } from './dto/subscription.dto';
import { TokenDto } from './dto/token.dto';

export interface ISubscriptionRepository {
  find(where: Prisma.SubscriptionWhereInput): Promise<Subscription[]>;
  create(data: Prisma.SubscriptionCreateInput): Promise<Subscription>;
  deleteByToken(token: string): Promise<void>;
}

export interface ISubscriptionMapper {
  mapToSubscriptionsDto(subscriptions: Subscription[]): SubscriptionsDto;
}

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @Inject(SubscriptionDiTokens.SUBSCRIPTION_REPOSITORY)
    private readonly repo: ISubscriptionRepository,

    @Inject(SubscriptionDiTokens.SUBSCRIPTION_MAPPER)
    private readonly mapper: ISubscriptionMapper,

    private readonly redis: RedisService
  ) {}

  async findByFrequency(frequency: Frequency): Promise<SubscriptionsDto> {
    const subscriptions = await this.repo.find({ frequency });
    return this.mapper.mapToSubscriptionsDto(subscriptions);
  }

  private async emailExists(email: string): Promise<boolean> {
    const emails = await this.repo.find({ email });
    return emails.length > 0;
  }

  private async tokenExists(token: string): Promise<boolean> {
    const items = await this.repo.find({ token });
    return items.length > 0;
  }

  async create(dto: SubscriptionDto): Promise<TokenDto> {
    const emailExists = await this.emailExists(dto.email);
    if (emailExists) {
      throw new GrpcAlreadyExistsException('Email');
    }
    const token = randomUUID();
    await this.redis.setObj<SubscriptionDto>(token, dto);
    return { token };
  }

  async confirm(token: string): Promise<void> {
    const data = await this.redis.getObj<SubscriptionDto>(token);
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
