import { Injectable, NotFoundException } from '@nestjs/common';
import { WeatherClientService } from '../weather-client/weather-client.service';
import { WeatherQuery } from './query/weather.query';
import { FindByFrequencyListResponse, GetResponse } from '@weather-api/interfaces';
import { Cron } from '@nestjs/schedule';
import { EmailClientService } from '../email-client/email-client.service';
import { SubscriptionClientService } from '../subscription-client/subscription-client.service';
import { Frequency } from '../subscription/enum/frequency.enum';

@Injectable()
export class WeatherService {
  constructor(
    private readonly weatherClient: WeatherClientService,
    private readonly emailClient: EmailClientService,
    private readonly subscriptionClient: SubscriptionClientService,
  ) {}

  async getWeather({ city }: WeatherQuery) {
    const { exists } = await this.weatherClient.cityExists({ city });
    if (!exists) throw new NotFoundException('City not found');
    const { current } = await this.weatherClient.get({ city }) as GetResponse;
    return {
      temperature: current.temperature,
      humidity: current.humidity,
      description: current.description,
    }
  }

  @Cron('0 * * * *')
  async handleHourlyEmails() {
    const res = await this.subscriptionClient.findByFrequency({
      frequency: Frequency.HOURLY,
    });
    await this.sendEmails(res);
  }

  @Cron('0 8 * * *')
  async handleDailyEmails() {
    const res = await this.subscriptionClient.findByFrequency({
      frequency: Frequency.DAILY,
    });
    await this.sendEmails(res);
  }

  private async sendEmails({ subscriptions }: FindByFrequencyListResponse) {
    for (const { email, city, token } of subscriptions) {
      const forecast = await this.weatherClient.get({ city }) as GetResponse;
      await this.emailClient.sendForecast({ email: email, token, ...forecast });
    }
  }
}
