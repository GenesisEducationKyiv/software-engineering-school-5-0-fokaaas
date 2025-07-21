export type DayRequest = {
  date: string;
  temperature: string;
  humidity: string;
  icon: string;
  description: string;
};

export type SendForecastRequest = {
  email: string;
  token: string;
  current: DayRequest;
  forecast: DayRequest[];
};
