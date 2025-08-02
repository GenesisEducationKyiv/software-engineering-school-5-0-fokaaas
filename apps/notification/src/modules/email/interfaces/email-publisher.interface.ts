import { SendForecastData } from '@shared-types/rmq/email';

export interface EmailPublisherInterface {
  pubForecastEmail(data: SendForecastData): void;
}
