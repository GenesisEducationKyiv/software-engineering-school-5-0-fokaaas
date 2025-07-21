import { Empty } from './common';

export type SendConfirmationRequest = {
  email: string;
  token: string;
};

export interface EmailServiceInterface {
  sendConfirmation(request: SendConfirmationRequest): Promise<Empty>;
}

export type EmailControllerInterface = EmailServiceInterface;
