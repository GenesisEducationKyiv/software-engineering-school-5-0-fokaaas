import { IsNotEmpty, IsUUID } from 'class-validator';

export class UnsubscribePath {
  @IsUUID(4, { message: 'Invalid token' })
  @IsNotEmpty({ message: 'Invalid token' })
  token: string;
}
