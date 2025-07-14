import { ConfirmationData } from './confirmation.data';

type ForecastItemData = {
  date: string;
  temperature: string;
  humidity: string;
  icon: string;
  description: string;
};

export type ForecastData = ConfirmationData & {
  current: ForecastItemData;
  forecast: ForecastItemData[];
};
