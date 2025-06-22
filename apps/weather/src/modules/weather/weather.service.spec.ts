import { WeatherService } from './weather.service';
import { Test } from '@nestjs/testing';
import { setupServer } from 'msw/node';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../common/config/configuration';
import { setupMswServer } from '../../common/utils/mocks/setup-msw-server';
import { WeatherModule } from './weather.module';

describe('WeatherService (unit)', () => {
  let service: WeatherService;
  let server: ReturnType<typeof setupServer>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        WeatherModule,
      ],
    }).compile();

    service = moduleRef.get(WeatherService);

    server = await setupMswServer();
    server.listen();
  });

  describe('cityExists', () => {
    it('should return true for existing city', async () => {
      const arg = { city: 'Kyiv' };

      const result = await service.cityExists(arg);
      expect(result).toEqual({ exists: true });
    });

    it('should return false for non-existing city', async () => {
      const arg = { city: 'NonExistingCity' };

      const result = await service.cityExists(arg);
      expect(result).toEqual({ exists: false });
    });
  });

  describe('getWeather', () => {
    it('should return mapped weather data for existing city', async () => {
      const arg = { city: 'Kyiv' };

      const result = await service.get(arg);

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
