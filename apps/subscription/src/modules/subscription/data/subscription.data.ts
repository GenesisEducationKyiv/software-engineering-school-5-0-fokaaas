import { Frequency } from '@prisma/client';

export type SubscriptionData = {
  email: string;
  city: string;
  frequency: Frequency;
};
