export interface EmailRequest {
  email: string;
}

export interface TokenRequest {
  token: string;
}

export interface FrequencyRequest {
  frequency: string;
}

export interface ExistsResponse {
  exists: boolean;
}

export interface MessageResponse {
  message: string;
}

export interface TokenResponse {
  token: string;
}

export interface FindByFrequencyResponse {
  email: string;
  city: string;
}

export interface FindByFrequencyListResponse {
  subscriptions: FindByFrequencyResponse[];
}

export interface CreateRequest extends EmailRequest, FrequencyRequest {
  city: string;
}

export interface ISubscriptionService {
  findByFrequency(request: FrequencyRequest): Promise<FindByFrequencyListResponse>;
  emailExists(request: EmailRequest): Promise<ExistsResponse>;
  create(request: CreateRequest): Promise<TokenResponse>;
  tokenExists(request: TokenRequest): Promise<ExistsResponse>;
  confirm(request: TokenRequest): Promise<MessageResponse>;
  unsubscribe(request: EmailRequest): Promise<MessageResponse>;
}

export interface ISubscriptionController extends ISubscriptionService {}
