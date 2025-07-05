import { Frequency } from '../enum/frequency.enum';

export class SubscriptionDto {
  email: string;
  city: string;
  frequency: Frequency;
}
