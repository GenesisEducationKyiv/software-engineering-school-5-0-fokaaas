import { Subscription } from '@prisma/client';
import { SubscriptionsDto } from '../dto/subscriptions.dto';

export interface SubscriptionMapperInterface {
  mapToSubscriptionsDto(subscriptions: Subscription[]): SubscriptionsDto;
}
