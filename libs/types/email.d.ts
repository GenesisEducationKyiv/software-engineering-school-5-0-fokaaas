export type Empty = Record<string, never>;

export type SendConfirmationRequest = {
  email: string;
  token: string;
}

export type DayRequest = {
  date: string;
  temperature: string;
  humidity: string;
  icon: string;
  description: string;
}

export type SendForecastRequest = {
  email: string;
  token: string;
  current: DayRequest;
  forecast: DayRequest[];
}

export interface IEmailService {
  sendConfirmation(request: SendConfirmationRequest): Promise<Empty>;
  sendForecast(request: SendForecastRequest): Promise<Empty>;
}

export type IEmailController = IEmailService;
