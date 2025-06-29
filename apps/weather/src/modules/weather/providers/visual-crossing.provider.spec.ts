import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../../common/config/configuration';
import { VisualCrossingConfig } from '../weather-service.factory';
import * as fs from 'fs/promises';
import { ProviderDomains } from '../constants/provider-domains.const';
import { VisualCrossingProvider } from './visual-crossing.provider';
import { http, HttpResponse } from 'msw';
import { mockServer } from '../../../common/utils/msw/setup';
import { HttpStatus } from '@nestjs/common';
import { HttpClientLoggerDecorator } from '../../http-client/decorators/http-client-logger.decorator';
import { HttpClientModule } from '../../http-client/http-client.module';
import { HttpClientService } from '../../http-client/http-client.service';

const getHandler = (
  responseObj: object | string,
  status: number,
  city: string
) => {
  return http.get(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/next6days`,
    () => HttpResponse.json(responseObj, { status })
  );
};

const responses = {
  ok: {
    currentConditions: {
      datetime: '23:00',
      temp: 21.5,
      humidity: 75,
      conditions: 'Partly cloudy',
      icon: 'partly-cloudy-night',
    },
    days: [
      {
        datetime: '2025-06-15',
        temp: 22.0,
        humidity: 70,
        conditions: 'Partly cloudy',
        icon: 'partly-cloudy-day',
      },
    ],
  },
  notFound: 'Bad API Request:Invalid location parameter value',
  unknownError: 'An unknown error occurred',
};

const logFilePath = `${configuration().logPath}/weather-provider.log`;

describe('VisualCrossingProvider (unit)', () => {
  let provider: VisualCrossingProvider;
  let spyHttpGet: jest.SpyInstance;
  const spyAppendFile = jest
    .spyOn(fs, 'appendFile')
    .mockResolvedValue(undefined);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        HttpClientModule,
      ],
      providers: [
        {
          provide: VisualCrossingProvider,
          useFactory: (
            configService: ConfigService,
            httpClientService: HttpClientService
          ) => {
            const { url, key, iconUrl } =
              configService.getOrThrow<VisualCrossingConfig>('visualCrossing');
            const httpClient = new HttpClientLoggerDecorator(
              httpClientService,
              ProviderDomains.VISUAL_CROSSING,
              logFilePath
            );
            return new VisualCrossingProvider(url, key, iconUrl, httpClient);
          },
          inject: [ConfigService, HttpClientService],
        },
      ],
    }).compile();

    provider = moduleRef.get(VisualCrossingProvider);
    const httpClientService = moduleRef.get(HttpClientService);
    spyHttpGet = jest.spyOn(httpClientService, 'get');

    jest.useFakeTimers().setSystemTime(new Date('2025-06-26T10:00:00.000Z'));
  });

  afterEach(() => {
    spyAppendFile.mockClear();
    spyHttpGet.mockRestore();
    jest.useRealTimers();
  });

  describe('cityExists', () => {
    it('should return true for existing city', async () => {
      const city = 'kyiv';

      mockServer.addHandlers(getHandler(responses.ok, HttpStatus.OK, city));

      const result = await provider.cityExists(city);
      expect(result).toBe(true);

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.VISUAL_CROSSING
        } - Response: ${JSON.stringify(responses.ok)}\n`
      );
    });

    it('should return false for non-existing city', async () => {
      const city = 'NonExistingCity';

      mockServer.addHandlers(
        getHandler(responses.notFound, HttpStatus.NOT_FOUND, city)
      );

      const result = await provider.cityExists(city);
      expect(result).toBe(false);

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.VISUAL_CROSSING
        } - Response: ${JSON.stringify(responses.notFound)}\n`
      );
    });

    it('throws unavailable exception for unknown error', async () => {
      const city = 'SomeCity';

      mockServer.addHandlers(
        getHandler(
          responses.unknownError,
          HttpStatus.INTERNAL_SERVER_ERROR,
          city
        )
      );

      await expect(provider.cityExists(city)).rejects.toThrow(
        'Service is temporary unavailable'
      );

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.VISUAL_CROSSING
        } - Response: ${JSON.stringify(responses.unknownError)}\n`
      );
    });

    it('should throw error for internal error', async () => {
      const city = 'SomeCity';
      const errorMsg = 'Network Error';

      spyHttpGet.mockRejectedValue(new Error(errorMsg));

      await expect(provider.cityExists(city)).rejects.toThrow(errorMsg);

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${ProviderDomains.VISUAL_CROSSING} - Unavailable\n`
      );
    });
  });

  describe('get', () => {
    it('should return mapped weather data for existing city', async () => {
      const city = 'kyiv';

      mockServer.addHandlers(getHandler(responses.ok, HttpStatus.OK, city));

      const result = await provider.get(city);
      expect(result).toEqual({
        current: {
          date: '23:00',
          description: 'Partly cloudy',
          humidity: '75',
          icon: expect.stringContaining('partly-cloudy-night.png'),
          temperature: '21.5',
        },
        forecast: [
          {
            date: '2025-06-15',
            description: 'Partly cloudy',
            humidity: '70',
            icon: expect.stringContaining('partly-cloudy-day.png'),
            temperature: '22.0',
          },
        ],
      });

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.VISUAL_CROSSING
        } - Response: ${JSON.stringify(responses.ok)}\n`
      );
    });

    it('should throw error for non-existing city', async () => {
      const city = 'nonExistingCity';

      mockServer.addHandlers(
        getHandler(responses.notFound, HttpStatus.NOT_FOUND, city)
      );

      await expect(provider.get(city)).rejects.toThrow('City not found');

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.VISUAL_CROSSING
        } - Response: ${JSON.stringify(responses.notFound)}\n`
      );
    });

    it('throws unavailable exception for unknown error', async () => {
      const city = 'SomeCity';

      mockServer.addHandlers(
        getHandler(
          responses.unknownError,
          HttpStatus.INTERNAL_SERVER_ERROR,
          city
        )
      );

      await expect(provider.get(city)).rejects.toThrow(
        'Service is temporary unavailable'
      );

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.VISUAL_CROSSING
        } - Response: ${JSON.stringify(responses.unknownError)}\n`
      );
    });

    it('should throw error for internal error', async () => {
      const city = 'SomeCity';
      const errorMsg = 'Network Error';

      spyHttpGet.mockRejectedValue(new Error(errorMsg));

      await expect(provider.get(city)).rejects.toThrow(errorMsg);

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${ProviderDomains.VISUAL_CROSSING} - Unavailable\n`
      );
    });
  });
});
