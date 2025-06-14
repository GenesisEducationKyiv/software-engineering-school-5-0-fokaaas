import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import type {
  Empty,
  IEmailService,
  SendConfirmationRequest,
  SendForecastRequest,
} from '@types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService implements IEmailService {
  private readonly frontBaseUrl: string;

  constructor(private mailer: MailerService, private config: ConfigService) {
    this.frontBaseUrl = this.config.get<string>('frontBaseUrl') ?? '';
  }

  async sendConfirmation({
    email,
    token,
  }: SendConfirmationRequest): Promise<Empty> {
    await this.mailer.sendMail({
      to: email,
      subject: '🍃 Confirm your email',
      template: 'confirmation.hbs',
      context: {
        link: `${this.frontBaseUrl}/confirm/${token}`,
      },
    });
    return {};
  }

  async sendForecast({
    email,
    token,
    ...context
  }: SendForecastRequest): Promise<Empty> {
    await this.mailer.sendMail({
      to: email,
      subject: '🚀 Your forecast is ready!',
      template: 'forecast.hbs',
      context: {
        unsubscribeLink: `${this.frontBaseUrl}/unsubscribe/${token}`,
        mainLink: `${this.frontBaseUrl}`,
        ...context,
      },
    });
    return {};
  }
}
