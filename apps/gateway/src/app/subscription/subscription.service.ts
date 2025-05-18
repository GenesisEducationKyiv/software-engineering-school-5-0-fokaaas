import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { WeatherClientService } from '../weather-client/weather-client.service';
import { EmailClientService } from '../email-client/email-client.service';
import { SubscriptionClientService } from '../subscription-client/subscription-client.service';
import { SubscribeBody } from './body/subscribe.body';
import { TokenPath } from './path/token.path';
import { UnsubscribeBody } from './body/unsubscribe.body';
import * as console from 'node:console';

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
    console.dir(exists)
    if (exists) {
      throw new ConflictException('Email already subscribed');
    }
    const { exists: cityExists } = await this.weatherClient.cityExists({
      city: body.city,
    });
    if (!cityExists) throw new NotFoundException('City not found');

    const { token } = await this.subscriptionClient.create(body);
    await this.emailClient.sendConfirmation({ email: body.email, token });
    return { message: 'Subscription successful. Confirmation email sent.' };
  }

  async confirm({ token }: TokenPath): Promise<{ message: string }> {
    const { exists } = await this.subscriptionClient.tokenExists({ token });
    if (!exists) {
      throw new NotFoundException('Token not found');
    }
    return this.subscriptionClient.confirm({ token });
  }

  async unsubscribe({ email }: UnsubscribeBody): Promise<{ message: string }> {
    const { exists } = await this.subscriptionClient.emailExists({ email });
    if (!exists) {
      throw new NotFoundException('Email not found');
    }
    return this.subscriptionClient.unsubscribe({ email });
  }
}
