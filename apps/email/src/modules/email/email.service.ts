import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { IEmailService } from './email.controller';
import { ConfirmationDto } from '../dto/confirmation.dto';
import { ForecastDto } from '../dto/forecast.dto';

@Injectable()
export class EmailService implements IEmailService {
  private readonly frontBaseUrl: string;

  constructor(
    private mailer: MailerService,
    private config: ConfigService
  ) {
    this.frontBaseUrl = this.config.getOrThrow<string>('frontBaseUrl');
  }

  async sendConfirmation({ email, token }: ConfirmationDto): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: '🍃 Confirm your email',
      template: 'confirmation.hbs',
      context: {
        link: `${this.frontBaseUrl}/confirm/${token}`,
      },
    });
  }

  async sendForecast({ email, token, ...context }: ForecastDto): Promise<void> {
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
