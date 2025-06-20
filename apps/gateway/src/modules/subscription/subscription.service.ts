import { Injectable, NotFoundException } from '@nestjs/common';
import { WeatherClientService } from '../weather-client/weather-client.service';
import { EmailClientService } from '../email-client/email-client.service';
import { SubscriptionClientService } from '../subscription-client/subscription-client.service';
import { SubscribeBody } from './body/subscribe.body';
import { TokenPath } from './path/token.path';
import { Errors } from '../../common/constants/errors.const';
import { SubscriptionMessages } from './constants/subscription-messages.const';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionClient: SubscriptionClientService,
    private readonly weatherClient: WeatherClientService,
    private readonly emailClient: EmailClientService
  ) {}

  async subscribe(body: SubscribeBody): Promise<{ message: string }> {
    const { exists: cityExists } = await this.weatherClient.cityExists({
      city: body.city,
    });
    if (!cityExists) throw new NotFoundException(Errors.CITY_NOT_FOUND);
    const { token } = await this.subscriptionClient.create(body);
    await this.emailClient.sendConfirmation({ email: body.email, token });
    return { message: SubscriptionMessages.SUBSCRIPTION_SUCCESS };
  }

  async confirm({ token }: TokenPath): Promise<{ message: string }> {
    await this.subscriptionClient.confirm({ token });
    return { message: SubscriptionMessages.SUBSCRIPTION_CONFIRMED };
  }

  async unsubscribe({ token }: TokenPath): Promise<{ message: string }> {
    await this.subscriptionClient.unsubscribe({ token });
    return { message: SubscriptionMessages.UNSUBSCRIBED_SUCCESSFULLY };
  }
}
