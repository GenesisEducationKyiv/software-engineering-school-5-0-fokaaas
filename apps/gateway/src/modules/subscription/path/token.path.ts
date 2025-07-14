import { IsNotEmpty, IsUUID } from 'class-validator';
import { SubscriptionErrors } from '../constants/subscription-errors.const';

export class TokenPath {
  @IsUUID(4, { message: SubscriptionErrors.INVALID_TOKEN })
  @IsNotEmpty({ message: SubscriptionErrors.INVALID_TOKEN })
  token: string;
}
