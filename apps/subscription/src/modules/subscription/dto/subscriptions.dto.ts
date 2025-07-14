type SubscriptionItemDto = {
  email: string;
  city: string;
  token: string;
};

export type SubscriptionsDto = {
  subscriptions: SubscriptionItemDto[];
};
