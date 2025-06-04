export type EmailRequest = {
  email: string;
};

export type TokenRequest = {
  token: string;
};

export type FrequencyRequest = {
  frequency: string;
};

export type ExistsResponse = {
  exists: boolean;
};

export type MessageResponse = {
  message: string;
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

export type CreateRequest = EmailRequest & FrequencyRequest & {
  city: string;
};

export interface ISubscriptionService {
  findByFrequency(
    request: FrequencyRequest
  ): Promise<FindByFrequencyListResponse>;
  emailExists(request: EmailRequest): Promise<ExistsResponse>;
  create(request: CreateRequest): Promise<TokenResponse>;
  tokenExists(request: TokenRequest): Promise<ExistsResponse>;
  confirm(request: TokenRequest): Promise<MessageResponse>;
  unsubscribe(request: TokenRequest): Promise<MessageResponse>;
}

export type ISubscriptionController = ISubscriptionService;
