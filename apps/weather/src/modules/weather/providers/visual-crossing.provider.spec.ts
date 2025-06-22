import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../../common/config/configuration';
import { VisualCrossingConfigs } from '../weather.module';
import * as fs from 'fs';
import { ProviderDomains } from '../constants/provider-domains.const';
import responses from '../../../common/utils/test/responses';
import { VisualCrossingProvider } from './visual-crossing.provider';

describe('WeatherApiProvider (unit)', () => {
  let provider: VisualCrossingProvider;
  let spyAppendFileSync: jest.SpyInstance;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
      providers: [
        {
          provide: VisualCrossingProvider,
          useFactory: (configService: ConfigService) => {
            const { url, key, iconUrl } =
              configService.get<VisualCrossingConfigs>(
                'visualCrossing'
              ) as VisualCrossingConfigs;
            return new VisualCrossingProvider(url, key, iconUrl);
          },
          inject: [ConfigService],
        },
      ],
    }).compile();

    provider = moduleRef.get(VisualCrossingProvider);
    spyAppendFileSync = jest
      .spyOn(fs, 'appendFileSync')
      .mockReturnValue(undefined);
  });

  afterEach(() => {
    spyAppendFileSync.mockClear();
  });

  describe('cityExists', () => {
    it('should return true for existing city', async () => {
      const arg = 'kyiv';
      const expected = true;

      const result = await provider.cityExists(arg);
      expect(result).toEqual(expected);

      expect(spyAppendFileSync).toHaveBeenCalledTimes(1);
      expect(spyAppendFileSync).toHaveBeenCalledWith(
        'logs/weather-providers.log',
        `${ProviderDomains.VISUAL_CROSSING} - Response: ${JSON.stringify(
          responses.visualCrossingSuccess
        )}\n`
      );
    });

    it('should return false for non-existing city', async () => {
      const arg = 'NonExistingCity';
      const expected = false;

      const result = await provider.cityExists(arg);
      expect(result).toEqual(expected);

      expect(spyAppendFileSync).toHaveBeenCalledTimes(1);
      expect(spyAppendFileSync).toHaveBeenCalledWith(
        'logs/weather-providers.log',
        `${ProviderDomains.VISUAL_CROSSING} - Response: ${JSON.stringify(
          responses.visualCrossingError
        )}\n`
      );
    });
  });

  describe('get', () => {
    it('should return mapped weather data for existing city', async () => {
      const arg = 'kyiv';
      const expected = {
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
      };

      const result = await provider.get(arg);
      expect(result).toEqual(expected);

      expect(spyAppendFileSync).toHaveBeenCalledTimes(1);
      expect(spyAppendFileSync).toHaveBeenCalledWith(
        'logs/weather-providers.log',
        `${ProviderDomains.VISUAL_CROSSING} - Response: ${JSON.stringify(
          responses.visualCrossingSuccess
        )}\n`
      );
    });

    it('should throw error for non-existing city', async () => {
      const arg = 'nonExistingCity';

      await expect(provider.get(arg)).rejects.toThrow('City not found');

      expect(spyAppendFileSync).toHaveBeenCalledTimes(1);
      expect(spyAppendFileSync).toHaveBeenCalledWith(
        'logs/weather-providers.log',
        `${ProviderDomains.VISUAL_CROSSING} - Response: ${JSON.stringify(
          responses.visualCrossingError
        )}\n`
      );
    });
  });
});
