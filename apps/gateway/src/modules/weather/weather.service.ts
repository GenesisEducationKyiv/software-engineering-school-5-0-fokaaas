import { Inject, Injectable } from '@nestjs/common';
import {
  Empty,
  FindByFrequencyListResponse,
  FrequencyRequest,
  GetWeatherRequest,
  GetWeatherResponse,
  SendForecastRequest,
} from '@types';
import { Cron } from '@nestjs/schedule';
import { Frequency } from '../subscription/enum/frequency.enum';
import { WeatherClientDiTokens } from '../weather-client/constants/di-tokens.const';
import { EmailClientDiTokens } from '../email-client/constants/di-tokens.const';
import { SubscriptionClientDiTokens } from '../subscription-client/constants/di-tokens.const';
import { IWeatherService } from './weather.controller';
import { CurrentWeatherDto } from './dto/current-weather.dto';

export interface ClientGetWeather {
  get(request: GetWeatherRequest): Promise<GetWeatherResponse>;
}

export interface ClientSendForecast {
  sendForecast(request: SendForecastRequest): Promise<Empty>;
}

export interface ClientFindSubsByFrequency {
  findByFrequency(
    request: FrequencyRequest
  ): Promise<FindByFrequencyListResponse>;
}

@Injectable()
export class WeatherService implements IWeatherService {
  constructor(
    @Inject(WeatherClientDiTokens.WEATHER_CLIENT_SERVICE)
    private readonly weatherClient: ClientGetWeather,

    @Inject(EmailClientDiTokens.EMAIL_CLIENT_SERVICE)
    private readonly emailClient: ClientSendForecast,

    @Inject(SubscriptionClientDiTokens.SUBSCRIPTION_CLIENT_SERVICE)
    private readonly subscriptionClient: ClientFindSubsByFrequency
  ) {}

  async getWeather(city: string): Promise<CurrentWeatherDto> {
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
