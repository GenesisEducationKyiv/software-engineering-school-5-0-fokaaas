import { Frequency } from '../enum/frequency.enum';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { SubscriptionErrors } from '../constants/subscription-errors.const';

export class SubscribeBody {
  @IsEmail({}, { message: SubscriptionErrors.INVALID_INPUT })
  @IsNotEmpty({ message: SubscriptionErrors.INVALID_INPUT })
  email: string;

  @IsNotEmpty({ message: SubscriptionErrors.INVALID_INPUT })
  city: string;

  @IsEnum(Frequency, { message: SubscriptionErrors.INVALID_INPUT })
  @IsNotEmpty({ message: SubscriptionErrors.INVALID_INPUT })
  @Transform(({ value }) => value.toUpperCase())
  frequency: Frequency;
}
