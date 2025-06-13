import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WeatherClientService } from '../weather-client/weather-client.service';
import { EmailClientService } from '../email-client/email-client.service';
import { SubscriptionClientService } from '../subscription-client/subscription-client.service';
import { SubscribeBody } from './body/subscribe.body';
import { TokenPath } from './path/token.path';
import { SubscriptionErrors } from './constants/subscription-errors.const';
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
    const { exists } = await this.subscriptionClient.emailExists({
      email: body.email,
    });
    if (exists) {
      throw new ConflictException(SubscriptionErrors.EMAIL_ALREADY_SUBSCRIBED);
    }
    const { exists: cityExists } = await this.weatherClient.cityExists({
      city: body.city,
    });
    if (!cityExists) throw new NotFoundException(Errors.CITY_NOT_FOUND);

    const { token } = await this.subscriptionClient.create(body);
    await this.emailClient.sendConfirmation({ email: body.email, token });
    return { message: SubscriptionMessages.SUBSCRIPTION_SUCCESS };
  }

  async confirm({ token }: TokenPath): Promise<{ message: string }> {
    const { exists } = await this.subscriptionClient.tokenExists({ token });
    if (!exists) {
      throw new NotFoundException('Token not found');
    }
    await this.subscriptionClient.confirm({ token });
    return { message: SubscriptionMessages.SUBSCRIPTION_CONFIRMED };
  }

  async unsubscribe({ token }: TokenPath): Promise<{ message: string }> {
    const { exists } = await this.subscriptionClient.tokenExists({ token });
    if (!exists) {
      throw new NotFoundException('Token not found');
    }
    await this.subscriptionClient.unsubscribe({ token });
    return { message: SubscriptionMessages.UNSUBSCRIBED_SUCCESSFULLY };
  }
}
