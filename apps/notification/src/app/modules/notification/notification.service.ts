import { Inject, Injectable } from '@nestjs/common';
import type { WeatherClientInterface } from '../weather/interfaces/weather-client.interface';
import { WeatherDiTokens } from '../weather/constants/di-tokens.const';
import { SubscriptionDiTokens } from '../subscription/constants/di-tokens.const';
import type { SubscriptionClientInterface } from '../subscription/interfaces/subscription-client.interface';
import { EmailDiTokens } from '../email/constants/di-tokens.const';
import type { EmailPublisherInterface } from '../email/interfaces/email-publisher.interface';
import { Frequency } from '../weather/enum/frequency.enum';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FindByFrequencyListResponse } from '@shared-types/grpc/subscription';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(SubscriptionDiTokens.SUBSCRIPTION_CLIENT)
    private readonly subscriptionClient: SubscriptionClientInterface,

    @Inject(WeatherDiTokens.WEATHER_CLIENT)
    private readonly weatherClient: WeatherClientInterface,

    @Inject(EmailDiTokens.EMAIL_PUBLISHER)
    private readonly emailPublisher: EmailPublisherInterface
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyEmails(): Promise<void> {
    const res = await this.subscriptionClient.findByFrequency({
      frequency: Frequency.HOURLY,
    });
    await this.sendEmails(res);
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async handleDailyEmails(): Promise<void> {
    const res = await this.subscriptionClient.findByFrequency({
      frequency: Frequency.DAILY,
    });
    await this.sendEmails(res);
  }

  private async sendEmails({ subscriptions }: FindByFrequencyListResponse) {
    for (const { email, city, token } of subscriptions) {
      const forecast = await this.weatherClient.get({ city });
      this.emailPublisher.pubForecastEmail({
        email: email,
        token,
        ...forecast,
      });
    }
  }
}
