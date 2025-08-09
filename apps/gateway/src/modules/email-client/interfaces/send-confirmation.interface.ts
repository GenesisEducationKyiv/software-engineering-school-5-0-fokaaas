import { SendConfirmationRequest } from '@shared-types/grpc/email';
import { Empty } from '@shared-types/grpc/common';

export interface SendConfirmationInterface {
  sendConfirmation(request: SendConfirmationRequest): Promise<Empty>;
}
