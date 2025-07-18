import { WeatherApiProvider } from './weather-api.provider';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../common/config/configuration';
import * as fs from 'fs/promises';
import { ProviderDomains } from '../constants/provider-domains.const';
import { http, HttpResponse } from 'msw';
import { mockServer } from '../../../common/utils/msw/setup';
import { HttpStatus } from '@nestjs/common';
import { HttpClientModule } from '../../http-client/http-client.module';
import { WeatherDiTokens } from '../constants/di-tokens.const';
import { WeatherApiProviderFactory } from '../factories/weather-api-provider.factory';
import { WeatherMapper } from '../weather.mapper';
import { HttpClientDiTokens } from '../../http-client/constants/di-tokens.const';

const getHandler = (responseObj: object, status: number) => {
  return http.get('https://api.weatherapi.com/v1/forecast.json', () =>
    HttpResponse.json(responseObj, { status })
  );
};

const responses = {
  ok: {
    current: {
      last_updated: '2025-06-15 23:00',
      temp_c: 21.5,
      humidity: 75,
      condition: {
        icon: '//cdn.weatherapi.com/weather/64x64/night/116.png',
        text: 'Partly cloudy',
      },
    },
    forecast: {
      forecastday: [
        {
          date: '2025-06-15',
          day: {
            avgtemp_c: 22.0,
            avghumidity: 70,
            condition: {
              icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
              text: 'Partly cloudy',
            },
          },
        },
      ],
    },
  },
  notFound: {
    error: {
      code: 1006,
      message: 'No matching location found.',
    },
  },
  unknownError: {
    error: {
      code: 9999,
      message: 'An unknown error occurred',
    },
  },
};

const logFilePath = `${configuration().logPath}/weather-provider.log`;

describe('WeatherApiProvider (unit)', () => {
  let provider: WeatherApiProvider;
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
        WeatherApiProviderFactory,
        {
          provide: WeatherDiTokens.WEATHER_MAPPER,
          useClass: WeatherMapper,
        },
        {
          provide: WeatherDiTokens.WEATHER_API_PROVIDER,
          useFactory: (factory: WeatherApiProviderFactory) => factory.create(),
          inject: [WeatherApiProviderFactory],
        },
      ],
    }).compile();

    provider = moduleRef.get(WeatherDiTokens.WEATHER_API_PROVIDER);
    const httpClientService = moduleRef.get(
      HttpClientDiTokens.HTTP_CLIENT_SERVICE
    );
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
      mockServer.addHandlers(getHandler(responses.ok, HttpStatus.OK));

      const arg = 'Kyiv';

      const result = await provider.cityExists(arg);
      expect(result).toBe(true);

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.WEATHER_API
        } - Response: ${JSON.stringify(responses.ok)}\n`
      );
    });

    it('should return false for non-existing city', async () => {
      mockServer.addHandlers(
        getHandler(responses.notFound, HttpStatus.NOT_FOUND)
      );

      const arg = 'NonExistingCity';

      const result = await provider.cityExists(arg);
      expect(result).toBe(false);

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.WEATHER_API
        } - Response: ${JSON.stringify(responses.notFound)}\n`
      );
    });

    it('throws unavailable exception for unknown error', async () => {
      const city = 'SomeCity';

      mockServer.addHandlers(
        getHandler(responses.unknownError, HttpStatus.INTERNAL_SERVER_ERROR)
      );

      await expect(provider.cityExists(city)).rejects.toThrow(
        'Service is temporary unavailable'
      );

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.WEATHER_API
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
        `[2025-06-26T10:00:00.000Z] ${ProviderDomains.WEATHER_API} - Unavailable\n`
      );
    });
  });

  describe('get', () => {
    it('should return mapped weather data for existing city', async () => {
      mockServer.addHandlers(getHandler(responses.ok, HttpStatus.OK));

      const arg = 'Kyiv';

      const result = await provider.get(arg);
      expect(result).toEqual({
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

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.WEATHER_API
        } - Response: ${JSON.stringify(responses.ok)}\n`
      );
    });

    it('should throw error for non-existing city', async () => {
      mockServer.addHandlers(
        getHandler(responses.notFound, HttpStatus.NOT_FOUND)
      );

      const arg = 'NonExistingCity';

      await expect(provider.get(arg)).rejects.toThrow('City not found');

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.WEATHER_API
        } - Response: ${JSON.stringify(responses.notFound)}\n`
      );
    });

    it('throws unavailable exception for unknown error', async () => {
      const city = 'SomeCity';

      mockServer.addHandlers(
        getHandler(responses.unknownError, HttpStatus.INTERNAL_SERVER_ERROR)
      );

      await expect(provider.get(city)).rejects.toThrow(
        'Service is temporary unavailable'
      );

      expect(spyAppendFile).toHaveBeenCalledTimes(1);
      expect(spyAppendFile).toHaveBeenCalledWith(
        logFilePath,
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.WEATHER_API
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
        `[2025-06-26T10:00:00.000Z] ${ProviderDomains.WEATHER_API} - Unavailable\n`
      );
    });
  });
});
