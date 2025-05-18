export interface Empty {}

export interface SendConfirmationRequest {
  email: string;
  token: string;
}

export interface DayRequest {
  date: string;
  temperature: string;
  humidity: string;
  icon: string;
  description: string;
}

export interface SendForecastRequest {
  email: string;
  current: DayRequest;
  forecast: DayRequest[];
}

export interface IEmailService {
  sendConfirmation(request: SendConfirmationRequest): Promise<Empty>;
  sendForecast(request: SendForecastRequest): Promise<Empty>;
}

export interface IEmailController extends IEmailService {}
