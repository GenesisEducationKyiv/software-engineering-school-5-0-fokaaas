import { Inject, Injectable } from '@nestjs/common';
import { FindByFrequencyListResponse } from '@types';
import { Cron } from '@nestjs/schedule';
import { Frequency } from '../subscription/enum/frequency.enum';
import { WeatherClientDiTokens } from '../weather-client/constants/di-tokens.const';
import { EmailClientDiTokens } from '../email-client/constants/di-tokens.const';
import { SubscriptionClientDiTokens } from '../subscription-client/constants/di-tokens.const';
import { CurrentWeatherData } from './data/current-weather.data';
import { WeatherServiceInterface } from './interfaces/weather-service.interface';
import type { GetWeatherInterface } from '../weather-client/interfaces/get-weather.interface';
import type { FindSubscriptionsInterface } from '../subscription-client/interfaces/find-subscriptions.interface';
import type { SendForecastInterface } from '../email-client/interfaces/send-forecast.interface';

@Injectable()
export class WeatherService implements WeatherServiceInterface {
  constructor(
    @Inject(WeatherClientDiTokens.WEATHER_CLIENT_SERVICE)
    private readonly weatherClient: GetWeatherInterface,

    @Inject(EmailClientDiTokens.EMAIL_CLIENT_SERVICE)
    private readonly emailClient: SendForecastInterface,

    @Inject(SubscriptionClientDiTokens.SUBSCRIPTION_CLIENT_SERVICE)
    private readonly subscriptionClient: FindSubscriptionsInterface
  ) {}

  async getWeather(city: string): Promise<CurrentWeatherData> {
    const { current } = await this.weatherClient.get({ city });
    return {
      temperature: current.temperature,
      humidity: current.humidity,
      description: current.description,
    };
  }

  @Cron('0 * * * *')
  async handleHourlyEmails(): Promise<void> {
    const res = await this.subscriptionClient.findByFrequency({
      frequency: Frequency.HOURLY,
    });
    await this.sendEmails(res);
  }

  @Cron('0 8 * * *')
  async handleDailyEmails(): Promise<void> {
    const res = await this.subscriptionClient.findByFrequency({
      frequency: Frequency.DAILY,
    });
    await this.sendEmails(res);
  }

  private async sendEmails({ subscriptions }: FindByFrequencyListResponse) {
    for (const { email, city, token } of subscriptions) {
      const forecast = await this.weatherClient.get({ city });
      await this.emailClient.sendForecast({ email: email, token, ...forecast });
    }
  }
}
