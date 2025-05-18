import { IsEmail, IsNotEmpty } from 'class-validator';

export class UnsubscribeBody {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Invalid email' })
  email: string;
}
