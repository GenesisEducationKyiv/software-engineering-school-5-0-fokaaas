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
}

export interface FindByFrequencyListResponse {
  emails: FindByFrequencyResponse[];
}

export interface CreateRequest extends EmailRequest, FrequencyRequest {}

export interface ISubscriptionService {
  findByFrequency(request: FrequencyRequest): Promise<FindByFrequencyListResponse>;
  emailExists(request: EmailRequest): Promise<ExistsResponse>;
  create(request: CreateRequest): Promise<TokenResponse>;
  tokenExists(request: TokenRequest): Promise<ExistsResponse>;
  confirm(request: TokenRequest): Promise<MessageResponse>;
}

export interface ISubscriptionController extends ISubscriptionService {}
