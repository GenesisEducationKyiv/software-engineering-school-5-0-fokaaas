import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as amqp from 'amqplib';
import { EmailModule } from './email.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../common/config/configuration';
import { validationSchema } from '../../common/config/validation';
import setupApp from '../../common/utils/setup-app';
import { MailerService } from '@nestjs-modules/mailer';
import { FilterModule } from '@shared/modules/filter/filter.module';
import { RpcException } from '@nestjs/microservices';
import { scheduler } from 'node:timers/promises';
import {
  EMAIL_QUEUE,
  EmailPatterns,
} from '@shared/common/constants/email-patterns.const';

describe('EmailConsumer (integration)', () => {
  let app: INestApplication;
  let channel: amqp.Channel;
  let channelModel: amqp.ChannelModel;
  let sendMailSpy: jest.SpyInstance;

  let publish: (pattern: string, data: object) => void;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
          validationSchema,
        }),
        FilterModule,
        EmailModule,
      ],
    }).compile();

    const mailerService = moduleRef.get(MailerService);
    sendMailSpy = jest.spyOn(mailerService, 'sendMail').mockResolvedValue({});

    app = moduleRef.createNestApplication();
    setupApp(app);

    await app.startAllMicroservices();

    channelModel = await amqp.connect('amqp://localhost:5672');
    channel = await channelModel.createChannel();

    publish = (pattern: string, data: object) => {
      channel.publish(
        'amq.topic',
        pattern,
        Buffer.from(JSON.stringify({ pattern, data }))
      );
    };
  });

  afterEach(async () => {
    await channel.purgeQueue(EMAIL_QUEUE);
    jest.clearAllMocks();
  });

  describe(EmailPatterns.FORECAST_EMAIL, () => {
    beforeAll(async () => {
      await channel.bindQueue(
        EMAIL_QUEUE,
        'amq.topic',
        EmailPatterns.FORECAST_EMAIL
      );
    });

    it('should consume one forecast_email and call sendForecast', async () => {
      const data = {
        email: 'user1@example.com',
        token: 'token123',
        current: {
          date: '2025-07-22',
          temperature: '25°C',
          humidity: '60%',
          icon: 'sunny',
          description: 'Clear sky',
        },
        forecast: [],
      };

      publish(EmailPatterns.FORECAST_EMAIL, data);

      await scheduler.wait(300);

      const { email, token, ...context } = data;

      expect(sendMailSpy).toHaveBeenCalledWith({
        to: email,
        subject: '🚀 Your forecast is ready!',
        template: 'forecast.hbs',
        context: {
          unsubscribeLink: `http://127.0.0.1:3000/unsubscribe/${token}`,
          mainLink: `http://127.0.0.1:3000`,
          ...context,
        },
      });
      expect(sendMailSpy).toHaveBeenCalledTimes(1);
    });

    it('should consume several forecast_email and call sendForecast', async () => {
      const messages = [
        {
          email: 'user1@example.com',
          token: 'token123',
          current: {
            date: '2025-07-22',
            temperature: '25°C',
            humidity: '60%',
            icon: 'sunny',
            description: 'Clear sky',
          },
          forecast: [],
        },
        {
          email: 'user2@example.com',
          token: 'token456',
          current: {
            date: '2025-07-22',
            temperature: '20°C',
            humidity: '50%',
            icon: 'cloudy',
            description: 'Cloudy',
          },
          forecast: [],
        },
      ];

      for (const data of messages) {
        publish(EmailPatterns.FORECAST_EMAIL, data);
      }

      await scheduler.wait(300);

      for (const data of messages) {
        const { email, token, ...context } = data;

        expect(sendMailSpy).toHaveBeenCalledWith({
          to: email,
          subject: '🚀 Your forecast is ready!',
          template: 'forecast.hbs',
          context: {
            unsubscribeLink: `http://127.0.0.1:3000/unsubscribe/${token}`,
            mainLink: `http://127.0.0.1:3000`,
            ...context,
          },
        });
      }

      expect(sendMailSpy).toHaveBeenCalledTimes(messages.length);
    });

    it('should retry once if sendMail throws error the first time', async () => {
      const data = {
        email: 'user3@example.com',
        token: 'token789',
        current: {
          date: '2025-07-22',
          temperature: '30°C',
          humidity: '40%',
          icon: 'sunny',
          description: 'Hot and dry',
        },
        forecast: [],
      };

      sendMailSpy.mockRejectedValueOnce(new RpcException('Temporary error'));

      publish(EmailPatterns.FORECAST_EMAIL, data);

      await scheduler.wait(300);

      const { email, token, ...context } = data;

      expect(sendMailSpy).toHaveBeenCalledTimes(2);
      expect(sendMailSpy).toHaveBeenLastCalledWith({
        to: email,
        subject: '🚀 Your forecast is ready!',
        template: 'forecast.hbs',
        context: {
          unsubscribeLink: `http://127.0.0.1:3000/unsubscribe/${token}`,
          mainLink: `http://127.0.0.1:3000`,
          ...context,
        },
      });
    });
  });

  it('should ignore unknown message patterns', async () => {
    publish('unknown_event', { any: 'thing' });
    await scheduler.wait(300);
    expect(sendMailSpy).not.toHaveBeenCalled();
  });

  afterAll(async () => {
    await channel.close();
    await channelModel.close();
    await app.close();
    jest.restoreAllMocks();
  });
});
