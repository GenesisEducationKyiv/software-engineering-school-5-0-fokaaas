import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SubscriptionMessages } from './constants/subscription-messages.const';
import * as request from 'supertest';
import { SubscriptionModule } from './subscription.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../config/configuration';
import { WeatherClientService } from '../weather-client/weather-client.service';
import { EmailClientService } from '../email-client/email-client.service';
import { join } from 'node:path';
import { SubscriptionErrors } from './constants/subscription-errors.const';
import { Errors } from '../../common/constants/errors.const';
import setupApp from '../../common/utils/setup-app';
import { NestExpressApplication } from '@nestjs/platform-express';
import Redis from 'ioredis';
import { Frequency } from '@prisma/client';
import { WeatherClientDiTokens } from '../weather-client/constants/di-tokens.const';
import { EmailClientDiTokens } from '../email-client/constants/di-tokens.const';

describe('SubscriptionController (integration)', () => {
  let app: INestApplication;
  let weatherClient: WeatherClientService;
  let emailClient: EmailClientService;

  let redis: Redis;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
          envFilePath: join(
            __dirname,
            '../../..',
            `.env.${process.env.NODE_ENV}`
          ),
        }),
        SubscriptionModule,
      ],
    }).compile();

    weatherClient = moduleRef.get(WeatherClientDiTokens.WEATHER_CLIENT_SERVICE);
    emailClient = moduleRef.get(EmailClientDiTokens.EMAIL_CLIENT_SERVICE);

    const redisConfig = moduleRef.get(ConfigService).getOrThrow('redis');

    redis = new Redis(redisConfig);

    app = moduleRef.createNestApplication<NestExpressApplication>();
    setupApp(app);

    await app.init();
  });

  describe('POST /api/subscribe', () => {
    let spyCityExists: jest.SpyInstance;
    let spySendConfirmation: jest.SpyInstance;

    beforeAll(() => {
      spyCityExists = jest.spyOn(weatherClient, 'cityExists');
      spySendConfirmation = jest.spyOn(emailClient, 'sendConfirmation');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should create a subscription and return message', async () => {
      spyCityExists.mockResolvedValue({ exists: true });
      spySendConfirmation.mockResolvedValue({});

      const response = await request(app.getHttpServer())
        .post('/api/subscribe')
        .send({
          email: 'test1@gmail.com',
          city: 'Kyiv',
          frequency: 'hourly',
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        message: SubscriptionMessages.SUBSCRIPTION_SUCCESS,
      });

      expect(spyCityExists).toHaveBeenCalledTimes(1);
      expect(spyCityExists).toHaveBeenCalledWith({ city: 'Kyiv' });

      expect(spySendConfirmation).toHaveBeenCalledTimes(1);
      expect(spySendConfirmation).toHaveBeenCalledWith({
        email: 'test1@gmail.com',
        token: expect.any(String), // token is generated, so we check if it's called with any string
      });
    });

    it('should responded with 400 if email is not valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/subscribe')
        .send({
          email: 'invalid-email',
          city: 'Kyiv',
          frequency: 'hourly',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        message: SubscriptionErrors.INVALID_INPUT,
      });
    });

    it('should respond with 404 if city not found', async () => {
      spyCityExists.mockResolvedValue({ exists: false });
      const response = await request(app.getHttpServer())
        .post('/api/subscribe')
        .send({
          email: 'test1@gmail.com',
          city: 'NonExistentCity',
          frequency: 'hourly',
        })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        message: Errors.CITY_NOT_FOUND,
      });

      expect(spyCityExists).toHaveBeenCalledTimes(1);
      expect(spyCityExists).toHaveBeenCalledWith({ city: 'NonExistentCity' });

      expect(spySendConfirmation).not.toHaveBeenCalled();
    });

    it('should respond with 400 if frequency is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/subscribe')
        .send({
          email: 'test1@gmail.com',
          city: 'Kyiv',
          frequency: 'invalid-frequency',
        })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        message: SubscriptionErrors.INVALID_INPUT,
      });
    });

    it('should respond with 409 if email already subscribed', async () => {
      spyCityExists.mockResolvedValue({ exists: true });

      const response = await request(app.getHttpServer())
        .post('/api/subscribe')
        .send({
          email: 'alreadyExists@gmail.com',
          city: 'Odesa',
          frequency: 'daily',
        })
        .expect(HttpStatus.CONFLICT);

      expect(response.body).toEqual({
        message: 'Email already exists',
      });
      expect(spySendConfirmation).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/confirm', () => {
    afterEach(async () => {
      await redis.flushdb();
    });

    it('should confirm subscription and respond with 200', async () => {
      const token = 'de86e58a-3dee-45dc-8c98-3df0a8eb45b2';
      await redis.set(
        `subscription:${token}`,
        JSON.stringify({
          email: 'test@gmail.com',
          city: 'Test City',
          frequency: Frequency.DAILY,
        })
      );

      const response = await request(app.getHttpServer())
        .get(`/api/confirm/${token}`)
        .send({ token })
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        message: SubscriptionMessages.SUBSCRIPTION_CONFIRMED,
      });
    });

    it('should respond with 400 if token has invalid format', async () => {
      const token = 'invalid';

      const response = await request(app.getHttpServer())
        .get(`/api/confirm/${token}`)
        .send({ token })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        message: SubscriptionErrors.INVALID_TOKEN,
      });
    });

    it('should respond with 404 if token not found', async () => {
      const token = 'da16ecc2-d3d4-4a5b-9b3c-ac7e3cc77cb7';

      const response = await request(app.getHttpServer())
        .get(`/api/confirm/${token}`)
        .send({ token })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        message: 'Token not found',
      });
    });
  });

  describe('GET /api/unsubscribe', () => {
    it('should unsubscribe and respond with 200', async () => {
      const token = 'd63c8e48-96a7-455d-9c71-73d49064bb1f';

      const response = await request(app.getHttpServer())
        .get(`/api/unsubscribe/${token}`)
        .send({ token })
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        message: SubscriptionMessages.UNSUBSCRIBED_SUCCESSFULLY,
      });
    });

    it('should respond with 400 if token has invalid format', async () => {
      const token = 'invalid';

      const response = await request(app.getHttpServer())
        .get(`/api/unsubscribe/${token}`)
        .send({ token })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        message: SubscriptionErrors.INVALID_TOKEN,
      });
    });

    it('should respond with 404 if token not found', async () => {
      const token = 'd2be7925-0a19-40c4-95a9-cdd88732a1a8';

      const response = await request(app.getHttpServer())
        .get(`/api/unsubscribe/${token}`)
        .send({ token })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        message: 'Token not found',
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
