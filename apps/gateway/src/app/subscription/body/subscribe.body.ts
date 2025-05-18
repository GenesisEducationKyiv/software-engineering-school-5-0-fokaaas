import { Frequency } from '../enum/frequency.enum';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class SubscribeBody {
  @IsEmail({}, { message: 'Invalid input' })
  @IsNotEmpty({ message: 'Invalid input' })
  email: string;

  @IsNotEmpty({ message: 'Invalid input' })
  city: string;

  @IsEnum(Frequency, { message: 'Invalid input' })
  @IsNotEmpty({ message: 'Invalid input' })
  @Transform(({ value }) => value.toUpperCase())
  frequency: Frequency;
}
