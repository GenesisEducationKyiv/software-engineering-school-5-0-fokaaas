import { ConfirmationDto } from './confirmation.dto';

class ForecastItemDto {
  date: string;
  temperature: string;
  humidity: string;
  icon: string;
  description: string;
}

export class ForecastDto extends ConfirmationDto {
  current: ForecastItemDto;
  forecast: ForecastItemDto[];
}
