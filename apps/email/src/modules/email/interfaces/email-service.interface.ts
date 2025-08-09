import { ConfirmationData } from '../data/confirmation.data';
import { ForecastData } from '../data/forecast.data';

export interface EmailServiceInterface {
  sendConfirmation(data: ConfirmationData): Promise<void>;
  sendForecast(data: ForecastData): Promise<void>;
}
