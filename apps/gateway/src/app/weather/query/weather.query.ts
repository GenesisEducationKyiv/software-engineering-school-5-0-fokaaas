import { IsNotEmpty, IsString } from 'class-validator';

export class WeatherQuery {
  @IsString({ message: 'Invalid request' })
  @IsNotEmpty({ message: 'Invalid request' })
  city: string;
}
