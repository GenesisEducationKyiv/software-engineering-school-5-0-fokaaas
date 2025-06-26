import { WeatherApiProvider } from './weather-api.provider';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../../common/config/configuration';
import { WeatherApiConfigs } from '../weather.module';
import * as fs from 'fs/promises';
import { ProviderDomains } from '../constants/provider-domains.const';
import responses from '../../../common/utils/test/responses';

describe('WeatherApiProvider (unit)', () => {
  let provider: WeatherApiProvider;
  let spyAppendFileSync: jest.SpyInstance;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
      providers: [
        {
          provide: WeatherApiProvider,
          useFactory: (configService: ConfigService) => {
            const { url, key } = configService.get<WeatherApiConfigs>(
              'weatherApi'
            ) as WeatherApiConfigs;
            return new WeatherApiProvider(url, key);
          },
          inject: [ConfigService],
        },
      ],
    }).compile();

    provider = moduleRef.get(WeatherApiProvider);
    spyAppendFileSync = jest
      .spyOn(fs, 'appendFile')
      .mockResolvedValue(undefined);
  });

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-06-26T10:00:00.000Z'));
  });

  afterEach(() => {
    spyAppendFileSync.mockClear();
    jest.useRealTimers();
  });

  describe('cityExists', () => {
    it('should return true for existing city', async () => {
      const arg = 'Kyiv';

      const result = await provider.cityExists(arg);
      expect(result).toBe(true);

      expect(spyAppendFileSync).toHaveBeenCalledTimes(1);
      expect(spyAppendFileSync).toHaveBeenCalledWith(
        'logs/weather-providers.log',
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.WEATHER_API
        } - Response: ${JSON.stringify(responses.weatherApiSuccess)}\n`
      );
    });

    it('should return false for non-existing city', async () => {
      const arg = 'NonExistingCity';

      const result = await provider.cityExists(arg);
      expect(result).toBe(false);

      expect(spyAppendFileSync).toHaveBeenCalledTimes(1);
      expect(spyAppendFileSync).toHaveBeenCalledWith(
        'logs/weather-providers.log',
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.WEATHER_API
        } - Response: ${JSON.stringify(responses.weatherApiError)}\n`
      );
    });
  });

  describe('get', () => {
    it('should return mapped weather data for existing city', async () => {
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

      expect(spyAppendFileSync).toHaveBeenCalledTimes(1);
      expect(spyAppendFileSync).toHaveBeenCalledWith(
        'logs/weather-providers.log',
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.WEATHER_API
        } - Response: ${JSON.stringify(responses.weatherApiSuccess)}\n`
      );
    });

    it('should throw error for non-existing city', async () => {
      const arg = 'NonExistingCity';

      await expect(provider.get(arg)).rejects.toThrow('City not found');

      expect(spyAppendFileSync).toHaveBeenCalledTimes(1);
      expect(spyAppendFileSync).toHaveBeenCalledWith(
        'logs/weather-providers.log',
        `[2025-06-26T10:00:00.000Z] ${
          ProviderDomains.WEATHER_API
        } - Response: ${JSON.stringify(responses.weatherApiError)}\n`
      );
    });
  });
});
