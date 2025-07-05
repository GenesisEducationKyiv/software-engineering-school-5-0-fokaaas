import { BaseSubscriptionDto } from './base-subscription.dto';

class SubscriptionItemDto extends BaseSubscriptionDto {
  token: string;
}

export class SubscriptionsDto {
  subscriptions: SubscriptionItemDto[];
}
