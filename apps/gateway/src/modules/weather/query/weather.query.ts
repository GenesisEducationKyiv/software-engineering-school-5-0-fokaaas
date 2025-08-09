import { IsNotEmpty, IsString } from 'class-validator';
import { WeatherErrors } from '../constants/weather-errors.const';

export class WeatherQuery {
  @IsString({ message: WeatherErrors.INVALID_REQUEST })
  @IsNotEmpty({ message: WeatherErrors.INVALID_REQUEST })
  city: string;
}
