import { Frequency, Subscription } from '@prisma/client';
import { SubscriptionData } from '../data/subscription.data';

export interface SubscriptionServiceInterface {
  findByFrequency(frequency: Frequency): Promise<Subscription[]>;
  create(data: SubscriptionData): Promise<string>;
  confirm(token: string): Promise<void>;
  unsubscribe(token: string): Promise<void>;
}
