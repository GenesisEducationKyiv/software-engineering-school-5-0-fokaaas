import { Injectable } from '@nestjs/common';
import { ISubscriptionMapper } from './subscription.service';
import { Subscription } from '@prisma/client';
import { SubscriptionsDto } from './dto/subscriptions.dto';

@Injectable()
export class SubscriptionMapper implements ISubscriptionMapper {
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
