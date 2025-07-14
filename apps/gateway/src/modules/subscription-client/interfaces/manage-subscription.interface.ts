import { CreateRequest, Empty, TokenRequest, TokenResponse } from '@types';

export interface ManageSubscriptionInterface {
  create(request: CreateRequest): Promise<TokenResponse>;
  confirm(request: TokenRequest): Promise<Empty>;
  unsubscribe(request: TokenRequest): Promise<Empty>;
}
