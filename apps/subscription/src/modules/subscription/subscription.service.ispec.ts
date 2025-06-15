import { Test } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { RedisService } from '../../database/redis/redis.service';
import { Frequency } from '@prisma/client';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionRepository } from './subscription.repository';
import { RedisModule } from '../../database/redis/redis.module';
import type {
  CreateRequest,
  FindByFrequencyListResponse,
  FrequencyRequest,
} from '@types';
import configuration from '../../common/config/configuration';

describe('SubscriptionService (integration)', () => {
  let service: SubscriptionService;
  let prisma: PrismaService;
  let redis: RedisService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        RedisModule,
      ],
      providers: [SubscriptionService, SubscriptionRepository, PrismaService],
    }).compile();

    service = moduleRef.get(SubscriptionService);
    prisma = moduleRef.get(PrismaService);
    redis = moduleRef.get(RedisService);
  });

  describe('findByFrequency', () => {
    it('should correctly return list of mapped subscriptions', async () => {
      const arg: FrequencyRequest = { frequency: Frequency.DAILY };
      const expected: FindByFrequencyListResponse = {
        subscriptions: [
          { email: 'example@mail.com', token: 'token', city: 'Kyiv' },
          { email: 'example1@mail.com', token: 'token1', city: 'Lviv' },
        ],
      };

      const result = await service.findByFrequency(arg);

      expect(result).toEqual(expected);
    });

    it('should return empty list if there no such subscriptions', async () => {
      const arg: FrequencyRequest = { frequency: Frequency.HOURLY };
      const expected: FindByFrequencyListResponse = { subscriptions: [] };

      const result = await service.findByFrequency(arg);
      expect(result).toEqual(expected);
    });
  });

  describe('create', () => {
    it('should create subscription and return token', async () => {
      const arg: CreateRequest = {
        email: 'testemail@gmail.com',
        city: 'Test City',
        frequency: Frequency.DAILY,
      };

      const result = await service.create(arg);
      expect(result.token).toBeTruthy();

      const data = await redis.getObj<CreateRequest>(result.token);
      expect(data).toEqual(arg);
    });

    it('should throw error if email already exists', async () => {
      const arg: CreateRequest = {
        email: 'example@mail.com',
        city: 'Kyiv',
        frequency: Frequency.DAILY,
      };
      const errorMessage = 'Email already exists';

      await expect(service.create(arg)).rejects.toThrow(errorMessage);
    });
  });

  describe('confirm', () => {
    it('should confirm subscription with valid token', async () => {
      const arg = { token: 'some-token' };

      const result = await service.confirm(arg);

      expect(result).toEqual({});

      const subscription = await prisma.subscription.findFirst({
        where: arg,
      });
      expect(subscription).not.toBeNull();
      expect(subscription?.email).toBe('example3@mail.com');
      expect(subscription?.city).toBe('Poltava');
      expect(subscription?.frequency).toBe(Frequency.DAILY);

      const redisObj = await redis.exists(arg.token);
      expect(redisObj).toBe(false); // token should be deleted from Redis
    });

    it('should throw error if token not found', async () => {
      const arg = { token: 'invalid' };
      const errorMessage = 'Token not found';

      await expect(service.confirm(arg)).rejects.toThrow(errorMessage);
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe with valid token', async () => {
      const arg = { token: 'token' };

      const result = await service.unsubscribe(arg);
      expect(result).toEqual({});

      const subscription = await prisma.subscription.findFirst({
        where: arg,
      });
      expect(subscription).toBeNull(); // subscription should be deleted
    });

    it('should throw error if token not found', async () => {
      const arg = { token: 'invalid' };
      const errorMessage = 'Token not found';

      await expect(service.unsubscribe(arg)).rejects.toThrow(errorMessage);
    });
  });
});
