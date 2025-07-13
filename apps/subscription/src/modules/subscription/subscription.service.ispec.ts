import { Test } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { RedisService } from '@utils';
import { Frequency } from '@prisma/client';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../common/config/configuration';
import { SubscriptionModule } from './subscription.module';
import { SubscriptionData } from './data/subscription.data';
import { SubscriptionDiTokens } from './constants/di-tokens.const';

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

    service = moduleRef.get(SubscriptionDiTokens.SUBSCRIPTION_SERVICE);
    prisma = moduleRef.get(PrismaService);
    redis = moduleRef.get(RedisService);
  });

  afterEach(async () => {
    await redis.flush();
  });

  describe('findByFrequency', () => {
    it('should correctly return list of mapped subscriptions', async () => {
      const result = await service.findByFrequency(Frequency.DAILY);

      expect(result).toEqual([
        {
          email: 'example@mail.com',
          token: 'token',
          city: 'Kyiv',
          frequency: Frequency.DAILY,
          id: expect.any(String),
        },
        {
          email: 'example1@mail.com',
          token: 'token1',
          city: 'Lviv',
          frequency: Frequency.DAILY,
          id: expect.any(String),
        },
        {
          email: 'alreadyExists@gmail.com',
          token: 'token2',
          city: 'Odesa',
          frequency: Frequency.DAILY,
          id: expect.any(String),
        },
        {
          email: 'unsubscribe@gmail.com',
          token: 'd63c8e48-96a7-455d-9c71-73d49064bb1f',
          city: 'Kharkiv',
          frequency: Frequency.DAILY,
          id: expect.any(String),
        },
      ]);
    });

    it('should return empty list if there no such subscriptions', async () => {
      const result = await service.findByFrequency(Frequency.HOURLY);
      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('saves creation data in redis under the returned token', async () => {
      const arg: SubscriptionData = {
        email: 'testemail@gmail.com',
        city: 'Test City',
        frequency: Frequency.DAILY,
      };

      const result = await service.create(arg);
      expect(result).toBeTruthy();

      const data = await redis.getObj<SubscriptionData>(result);
      expect(data).toEqual(arg);
    });

    it('throws if email already exists', async () => {
      const arg: SubscriptionData = {
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
      const data: SubscriptionData = {
        frequency: Frequency.DAILY,
        city: 'Poltava',
        email: 'example3@mail.com',
      };
      await redis.setObj<SubscriptionData>(token, data);

      const result = await service.confirm(token);

      expect(result).toBeUndefined();

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
      const token = 'invalid';
      const errorMessage = 'Token not found';

      await expect(service.confirm(token)).rejects.toThrow(errorMessage);
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
      const token = 'token';

      const result = await service.unsubscribe(token);
      expect(result).toBeUndefined();

      const subscription = await prisma.subscription.findFirst({
        where: { token },
      });
      expect(subscription).toBeNull(); // subscription should be deleted

      expect(spyTokenExists).toHaveBeenCalledTimes(1);
      expect(spyTokenExists).toHaveBeenCalledWith(token);
    });

    it('should throw error if token not found', async () => {
      const token = 'invalid';

      await expect(service.unsubscribe(token)).rejects.toThrow(
        'Token not found'
      );

      expect(spyTokenExists).toHaveBeenCalledTimes(1);
      expect(spyTokenExists).toHaveBeenCalledWith(token);
    });
  });
});
