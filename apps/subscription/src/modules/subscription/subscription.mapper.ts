import { Injectable } from '@nestjs/common';
import { Subscription } from '@prisma/client';
import { SubscriptionsDto } from './dto/subscriptions.dto';
import { SubscriptionMapperInterface } from './interfaces/subscription-mapper.interface';

@Injectable()
export class SubscriptionMapper implements SubscriptionMapperInterface {
  mapToSubscriptionsDto(subscriptions: Subscription[]): SubscriptionsDto {
    return {
      subscriptions: subscriptions.map((s) => ({
        email: s.email,
        city: s.city,
        token: s.token,
      })),
    };
  }
}
