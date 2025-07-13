import { Empty, SendConfirmationRequest } from '@types';

export interface SendConfirmationInterface {
  sendConfirmation(request: SendConfirmationRequest): Promise<Empty>;
}
