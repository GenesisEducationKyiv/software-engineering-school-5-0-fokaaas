import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Errors } from '../../common/constants/errors.const';
import { SubscriptionMessages } from './constants/subscription-messages.const';
import { SubscriptionClientDiTokens } from '../subscription-client/constants/di-tokens.const';
import { WeatherClientDiTokens } from '../weather-client/constants/di-tokens.const';
import { EmailClientDiTokens } from '../email-client/constants/di-tokens.const';
import type { WeatherCityExistsInterface } from '../weather-client/interfaces/city-exists.interface';
import { SubscriptionServiceInterface } from './interfaces/subscription-service.interface';
import { SubscriptionData } from './data/subscription.data';
import type { ManageSubscriptionInterface } from '../subscription-client/interfaces/manage-subscription.interface';
import type { SendConfirmationInterface } from '../email-client/interfaces/send-confirmation.interface';

@Injectable()
export class SubscriptionService implements SubscriptionServiceInterface {
  constructor(
    @Inject(SubscriptionClientDiTokens.SUBSCRIPTION_CLIENT_SERVICE)
    private readonly subscriptionClient: ManageSubscriptionInterface,

    @Inject(WeatherClientDiTokens.WEATHER_CLIENT_SERVICE)
    private readonly weatherClient: WeatherCityExistsInterface,

    @Inject(EmailClientDiTokens.EMAIL_CLIENT_SERVICE)
    private readonly emailClient: SendConfirmationInterface
  ) {}

  async subscribe(data: SubscriptionData): Promise<string> {
    const { exists: cityExists } = await this.weatherClient.cityExists({
      city: data.city,
    });
    if (!cityExists) throw new NotFoundException(Errors.CITY_NOT_FOUND);
    const { token } = await this.subscriptionClient.create(data);
    await this.emailClient.sendConfirmation({ email: data.email, token });
    return SubscriptionMessages.SUBSCRIPTION_SUCCESS;
  }

  async confirm(token: string): Promise<string> {
    await this.subscriptionClient.confirm({ token });
    return SubscriptionMessages.SUBSCRIPTION_CONFIRMED;
  }

  async unsubscribe(token: string): Promise<string> {
    await this.subscriptionClient.unsubscribe({ token });
    return SubscriptionMessages.UNSUBSCRIBED_SUCCESSFULLY;
  }
}
