import { SubscriptionData } from '../data/subscription.data';

export interface SubscriptionServiceInterface {
  subscribe(data: SubscriptionData): Promise<string>;
  confirm(token: string): Promise<string>;
  unsubscribe(token: string): Promise<string>;
}
