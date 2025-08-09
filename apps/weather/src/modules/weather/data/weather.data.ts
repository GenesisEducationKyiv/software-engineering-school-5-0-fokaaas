type WeatherItemData = {
  date: string;
  temperature: string;
  humidity: string;
  icon: string;
  description: string;
};

export class WeatherData {
  current: WeatherItemData;
  forecast: WeatherItemData[];
}
