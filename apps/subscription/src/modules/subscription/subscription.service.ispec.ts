import { Test } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { RedisService } from '@utils';
import { Frequency } from '@prisma/client';
import { ConfigModule } from '@nestjs/config';
import type { CreateRequest, FrequencyRequest } from '@types';
import configuration from '../../common/config/configuration';
import { SubscriptionModule } from './subscription.module';

describe('SubscriptionService (integration)', () => {
  let service: SubscriptionService;
  let prisma: PrismaService;
  let redis: RedisService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        SubscriptionModule,
      ],
    }).compile();

    service = moduleRef.get(SubscriptionService);
    prisma = moduleRef.get(PrismaService);
    redis = moduleRef.get(RedisService);
  });

  afterEach(async () => {
    await redis.flush();
  });

  describe('findByFrequency', () => {
    it('should correctly return list of mapped subscriptions', async () => {
      const arg: FrequencyRequest = { frequency: Frequency.DAILY };

      const result = await service.findByFrequency(arg);

      expect(result).toEqual({
        subscriptions: [
          { email: 'example@mail.com', token: 'token', city: 'Kyiv' },
          { email: 'example1@mail.com', token: 'token1', city: 'Lviv' },
          { email: 'alreadyExists@gmail.com', token: 'token2', city: 'Odesa' },
          {
            email: 'unsubscribe@gmail.com',
            token: 'd63c8e48-96a7-455d-9c71-73d49064bb1f',
            city: 'Kharkiv',
          },
        ],
      });
    });

    it('should return empty list if there no such subscriptions', async () => {
      const arg: FrequencyRequest = { frequency: Frequency.HOURLY };

      const result = await service.findByFrequency(arg);
      expect(result).toEqual({ subscriptions: [] });
    });
  });

  describe('create', () => {
    it('saves creation data in redis under the returned token', async () => {
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

    it('throws if email already exists', async () => {
      const arg: CreateRequest = {
        email: 'example@mail.com',
        city: 'Kyiv',
        frequency: Frequency.DAILY,
      };

      await expect(service.create(arg)).rejects.toThrow('Email already exists');
    });
  });

  describe('confirm', () => {
    it('should confirm subscription with valid token', async () => {
      const token = '114e05a1-b9a2-4a27-a269-d6eb6dc6a705';
      const data: CreateRequest = {
        frequency: Frequency.DAILY,
        city: 'Poltava',
        email: 'example3@mail.com',
      };
      await redis.setObj<CreateRequest>(token, data);

      const result = await service.confirm({ token });

      expect(result).toEqual({});

      const subscription = await prisma.subscription.findFirst({
        where: { token },
      });
      expect(subscription).not.toBeNull();
      expect(subscription?.email).toBe(data.email);
      expect(subscription?.city).toBe(data.city);
      expect(subscription?.frequency).toBe(data.frequency);

      const redisObj = await redis.getObj(token);
      expect(redisObj).toBeNull(); // token should be deleted from Redis
    });

    it('should throw error if token not found', async () => {
      const arg = { token: 'invalid' };
      const errorMessage = 'Token not found';

      await expect(service.confirm(arg)).rejects.toThrow(errorMessage);
    });
  });

  describe('unsubscribe', () => {
    let spyTokenExists: jest.SpyInstance;

    beforeAll(() => {
      spyTokenExists = jest.spyOn(
        service,
        'tokenExists' as keyof SubscriptionService
      );
    });

    afterEach(() => {
      spyTokenExists.mockReset();
    });

    it('should unsubscribe with valid token', async () => {
      const arg = { token: 'token' };

      const result = await service.unsubscribe(arg);
      expect(result).toEqual({});

      const subscription = await prisma.subscription.findFirst({
        where: arg,
      });
      expect(subscription).toBeNull(); // subscription should be deleted

      expect(spyTokenExists).toHaveBeenCalledTimes(1);
      expect(spyTokenExists).toHaveBeenCalledWith(arg.token);
    });

    it('should throw error if token not found', async () => {
      const arg = { token: 'invalid' };

      await expect(service.unsubscribe(arg)).rejects.toThrow('Token not found');

      expect(spyTokenExists).toHaveBeenCalledTimes(1);
      expect(spyTokenExists).toHaveBeenCalledWith(arg.token);
    });
  });
});
