type DayForecastData = {
  date: string;
  temperature: string;
  humidity: string;
  icon: string;
  description: string;
};

export type SendForecastData = {
  email: string;
  token: string;
  current: DayForecastData;
  forecast: DayForecastData[];
};
