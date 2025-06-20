import { Test } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { WeatherClientService } from '../weather-client/weather-client.service';
import { SubscriptionClientService } from '../subscription-client/subscription-client.service';
import { EmailClientService } from '../email-client/email-client.service';
import { Errors } from '../../common/constants/errors.const';
import { WeatherController } from './weather.controller';
import setupApp from '../../common/utils/setup-app';
import { NestExpressApplication } from '@nestjs/platform-express';

describe('WeatherController (integration)', () => {
  let app: INestApplication;
  let weatherClientMock: Partial<jest.Mocked<WeatherClientService>>;

  beforeAll(async () => {
    weatherClientMock = {
      cityExists: jest.fn(),
      get: jest.fn(),
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
          useValue: {},
        },
        {
          provide: EmailClientService,
          useValue: {},
        },
      ],
      controllers: [WeatherController],
    }).compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    setupApp(app);

    await app.init();
  });

  describe('GET /api/weather', () => {
    afterEach(() => {
      weatherClientMock.get?.mockReset();
      weatherClientMock.cityExists?.mockReset();
    });

    it('should return weather data for existing city', async () => {
      weatherClientMock.get?.mockResolvedValue({
        current: {
          date: '2025-06-15 23:00',
          description: 'Partly cloudy',
          humidity: '75',
          icon: 'cdn.weatherapi.com/weather/64x64/night/116.png',
          temperature: '21.5',
        },
        forecast: [
          {
            date: '2025-06-15',
            description: 'Partly cloudy',
            humidity: '70',
            icon: 'cdn.weatherapi.com/weather/64x64/day/116.png',
            temperature: '22.0',
          },
        ],
      });

      weatherClientMock.cityExists?.mockResolvedValue({ exists: true });

      const query = { city: 'Kyiv' };

      const expectedResponse = {
        temperature: '21.5',
        humidity: '75',
        description: 'Partly cloudy',
      };

      const response = await request(app.getHttpServer())
        .get('/api/weather')
        .query(query)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(expectedResponse);

      expect(weatherClientMock.cityExists).toHaveBeenCalledTimes(1);
      expect(weatherClientMock.cityExists).toHaveBeenCalledWith(query);

      expect(weatherClientMock.get).toHaveBeenCalledTimes(1);
      expect(weatherClientMock.get).toHaveBeenCalledWith(query);
    });

    it('should return 404 for non-existing city', async () => {
      weatherClientMock.cityExists?.mockResolvedValue({ exists: false });

      const query = { city: 'NonExistingCity' };
      const expectedResponse = {
        message: Errors.CITY_NOT_FOUND,
      };

      const response = await request(app.getHttpServer())
        .get('/api/weather')
        .query(query)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual(expectedResponse);

      expect(weatherClientMock.cityExists).toHaveBeenCalledTimes(1);
      expect(weatherClientMock.cityExists).toHaveBeenCalledWith(query);

      expect(weatherClientMock.get).not.toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
