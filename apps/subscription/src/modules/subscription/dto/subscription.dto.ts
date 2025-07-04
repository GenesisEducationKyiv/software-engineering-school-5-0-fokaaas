import { Frequency } from '@prisma/client';
import { BaseSubscriptionDto } from './base-subscription.dto';

export class SubscriptionDto extends BaseSubscriptionDto {
  frequency: Frequency;
}
