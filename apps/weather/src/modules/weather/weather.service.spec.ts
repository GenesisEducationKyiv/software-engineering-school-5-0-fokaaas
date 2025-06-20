import { WeatherService } from './weather.service';
import { Test } from '@nestjs/testing';
import { setupServer } from 'msw/node';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../common/config/configuration';
import { setupMswServer } from '../../common/utils/mocks/setupMswServer';

describe('WeatherService (unit)', () => {
  let service: WeatherService;
  let server: ReturnType<typeof setupServer>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
      providers: [WeatherService],
    }).compile();

    service = moduleRef.get(WeatherService);

    server = await setupMswServer();
    server.listen();
  });

  describe('cityExists', () => {
    it('should return true for existing city', async () => {
      const arg = { city: 'Kyiv' };
      const expected = { exists: true };

      const result = await service.cityExists(arg);
      expect(result).toEqual(expected);
    });

    it('should return false for non-existing city', async () => {
      const arg = { city: 'NonExistingCity' };
      const expected = { exists: false };

      const result = await service.cityExists(arg);
      expect(result).toEqual(expected);
    });
  });

  describe('getWeather', () => {
    it('should return mapped weather data for existing city', async () => {
      const arg = { city: 'Kyiv' };
      const expected = {
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
      };

      const result = await service.get(arg);
      expect(result).toEqual(expected);
    });

    it('should throw error for non-existing city', async () => {
      const arg = { city: 'NonExistingCity' };

      await expect(service.get(arg)).rejects.toThrow('City not found');
    });
  });

  afterAll(() => {
    server.close();
  });
});
