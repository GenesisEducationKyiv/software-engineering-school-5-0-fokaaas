import {
  CreateRequest,
  TokenRequest,
  TokenResponse,
} from '@shared-types/grpc/subscription';
import { Empty } from '@shared-types/grpc/common';

export interface ManageSubscriptionInterface {
  create(request: CreateRequest): Promise<TokenResponse>;
  confirm(request: TokenRequest): Promise<Empty>;
  unsubscribe(request: TokenRequest): Promise<Empty>;
}
