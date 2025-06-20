import { Empty } from './index';

export type EmailRequest = {
  email: string;
};

export type TokenRequest = {
  token: string;
};

export type FrequencyRequest = {
  frequency: 'HOURLY' | 'DAILY';
};

export type ExistsResponse = {
  exists: boolean;
};

export type TokenResponse = {
  token: string;
};

export type FindByFrequencyResponse = {
  email: string;
  city: string;
  token: string;
};

export type FindByFrequencyListResponse = {
  subscriptions: FindByFrequencyResponse[];
};

export type CreateRequest = EmailRequest &
  FrequencyRequest & {
    city: string;
  };

export interface ISubscriptionService {
  findByFrequency(
    request: FrequencyRequest
  ): Promise<FindByFrequencyListResponse>;
  create(request: CreateRequest): Promise<TokenResponse>;
  confirm(request: TokenRequest): Promise<Empty>;
  unsubscribe(request: TokenRequest): Promise<Empty>;
}

export type ISubscriptionController = ISubscriptionService;
