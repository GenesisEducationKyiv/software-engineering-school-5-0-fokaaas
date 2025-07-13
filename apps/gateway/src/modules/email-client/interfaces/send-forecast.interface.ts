import { Empty, SendForecastRequest } from '@types';

export interface SendForecastInterface {
  sendForecast(request: SendForecastRequest): Promise<Empty>;
}
