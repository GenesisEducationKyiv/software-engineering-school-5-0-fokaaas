import { WeatherService } from './weather.service';
import { WeatherClientService } from '../weather-client/weather-client.service';
import { SubscriptionClientService } from '../subscription-client/subscription-client.service';
import { EmailClientService } from '../email-client/email-client.service';
import { Test } from '@nestjs/testing';

describe('WeatherService (integration)', () => {
  let weatherService: WeatherService;
  let weatherClientMock: Partial<jest.Mocked<WeatherClientService>>;
  let subscriptionClientMock: Partial<jest.Mocked<SubscriptionClientService>>;
  let emailClientMock: Partial<jest.Mocked<EmailClientService>>;

  beforeAll(async () => {
    weatherClientMock = {
      cityExists: jest.fn(),
      get: jest.fn().mockResolvedValue({
        current: {
          temperature: 20,
          humidity: 50,
          description: 'Sunny',
        },
      }),
    };

    subscriptionClientMock = {
      findByFrequency: jest.fn(),
    };

    emailClientMock = {
      sendForecast: jest.fn(),
      sendConfirmation: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: WeatherClientService,
          useValue: weatherClientMock,
        },
        {
          provide: SubscriptionClientService,
          useValue: subscriptionClientMock,
        },
        {
          provide: EmailClientService,
          useValue: emailClientMock,
        },
      ],
    }).compile();

    weatherService = moduleRef.get<WeatherService>(WeatherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleDailyEmails', () => {
    it('should process 70 subscriptions', async () => {
      const subscriptions = Array.from({ length: 70 }, (_, idx) => ({
        email: `user${idx}@test.com`,
        city: 'Kyiv',
        token: `token${idx}`,
      }));

      subscriptionClientMock.findByFrequency?.mockResolvedValueOnce({
        subscriptions,
      });

      await weatherService.handleDailyEmails();

      expect(subscriptionClientMock.findByFrequency).toHaveBeenCalledTimes(1);
      expect(weatherClientMock.get).toHaveBeenCalledTimes(70);
      expect(emailClientMock.sendForecast).toHaveBeenCalledTimes(70);
    });

    it('should handle empty subscriptions', async () => {
      subscriptionClientMock.findByFrequency?.mockResolvedValueOnce({
        subscriptions: [],
      });

      await weatherService.handleDailyEmails();

      expect(subscriptionClientMock.findByFrequency).toHaveBeenCalledTimes(1);
      expect(weatherClientMock.get).toHaveBeenCalledTimes(0);
      expect(emailClientMock.sendForecast).toHaveBeenCalledTimes(0);
    });
  });

  describe('handleHourlyEmails', () => {
    it('should process 70 subscriptions', async () => {
      const subscriptions = Array.from({ length: 70 }, (_, idx) => ({
        email: `user${idx}@test.com`,
        city: 'Kyiv',
        token: `token${idx}`,
      }));

      subscriptionClientMock.findByFrequency?.mockResolvedValueOnce({
        subscriptions,
      });

      await weatherService.handleHourlyEmails();

      expect(subscriptionClientMock.findByFrequency).toHaveBeenCalledTimes(1);
      expect(weatherClientMock.get).toHaveBeenCalledTimes(70);
      expect(emailClientMock.sendForecast).toHaveBeenCalledTimes(70);
    });

    it('should handle empty subscriptions', async () => {
      subscriptionClientMock.findByFrequency?.mockResolvedValueOnce({
        subscriptions: [],
      });

      await weatherService.handleHourlyEmails();

      expect(subscriptionClientMock.findByFrequency).toHaveBeenCalledTimes(1);
      expect(weatherClientMock.get).toHaveBeenCalledTimes(0);
      expect(emailClientMock.sendForecast).toHaveBeenCalledTimes(0);
    });
  });
});
