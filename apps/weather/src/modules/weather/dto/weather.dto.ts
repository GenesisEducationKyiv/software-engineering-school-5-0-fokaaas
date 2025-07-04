export class WeatherItemDto {
  date: string;
  temperature: string;
  humidity: string;
  icon: string;
  description: string;
}

export class WeatherDto {
  current: WeatherItemDto;
  forecast: WeatherItemDto[];
}
