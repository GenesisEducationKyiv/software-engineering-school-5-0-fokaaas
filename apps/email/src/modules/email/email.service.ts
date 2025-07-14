import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ConfirmationData } from './data/confirmation.data';
import { ForecastData } from './data/forecast.data';
import { EmailServiceInterface } from './interfaces/email-service.interface';

@Injectable()
export class EmailService implements EmailServiceInterface {
  private readonly frontBaseUrl: string;

  constructor(
    private mailer: MailerService,
    private config: ConfigService
  ) {
    this.frontBaseUrl = this.config.getOrThrow<string>('frontBaseUrl');
  }

  async sendConfirmation({ email, token }: ConfirmationData): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: '🍃 Confirm your email',
      template: 'confirmation.hbs',
      context: {
        link: `${this.frontBaseUrl}/confirm/${token}`,
      },
    });
  }

  async sendForecast({
    email,
    token,
    ...context
  }: ForecastData): Promise<void> {
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
  }
}
