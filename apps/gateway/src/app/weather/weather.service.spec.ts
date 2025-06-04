import { WeatherService } from './weather.service';
import { Test } from '@nestjs/testing';
import { WeatherClientService } from '../weather-client/weather-client.service';
import { NotFoundException } from '@nestjs/common';
import { WeatherClientModule } from '../weather-client/weather-client.module';

describe('WeatherService', () => {
  let service: WeatherService;
  let weatherClient: WeatherClientService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [WeatherService],
      imports: [WeatherClientModule],
    }).compile();

    service = moduleRef.get(WeatherService);
    weatherClient = moduleRef.get(WeatherClientService);
  });

  describe('getWeather', () => {
    it('should return weather data for a valid city', async () => {
      const city = 'London';
      const result = {
        current: {
          temperature: '20',
          humidity: '50',
          description: 'Sunny',
        },
      };

      jest.spyOn(weatherClient, 'cityExists')
        .mockImplementation(async () => ({ exists: true }));

      jest.spyOn(weatherClient, 'get').mockImplementation(async () => ({
        current: {
          temperature: '20',
          humidity: '50',
          description: 'Sunny',
          date: '02-02-1998',
          icon: 'icon',
        },
        forecast: [],
      }));

      const weather = await service.getWeather({ city });
      expect(weather).toEqual(result);
      expect(weatherClient.cityExists).toHaveBeenCalledWith({ city });
      expect(weatherClient.get).toHaveBeenCalledWith({ city });
    });

    it('should throw NotFoundException for an invalid city', async () => {
      const city = 'InvalidCity';
      jest.spyOn(weatherClient, 'cityExists').mockResolvedValue({ exists: false });
      await expect(service.getWeather({ city })).rejects.toThrow(NotFoundException);
      expect(weatherClient.cityExists).toHaveBeenCalledWith({ city });
    });
  });
});
