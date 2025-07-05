import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Errors } from '../../common/constants/errors.const';
import { SubscriptionMessages } from './constants/subscription-messages.const';
import {
  CityExistsRequest,
  CityExistsResponse,
  CreateRequest,
  Empty,
  SendConfirmationRequest,
  TokenRequest,
  TokenResponse,
} from '@types';
import { SubscriptionClientDiTokens } from '../subscription-client/constants/di-tokens.const';
import { WeatherClientDiTokens } from '../weather-client/constants/di-tokens.const';
import { EmailClientDiTokens } from '../email-client/constants/di-tokens.const';
import { ISubscriptionService } from './subscription.controller';
import { SubscriptionDto } from './dto/subscription.dto';
import { MessageDto } from './dto/message.dto';

export interface SubscriptionClient {
  create(request: CreateRequest): Promise<TokenResponse>;
  confirm(request: TokenRequest): Promise<Empty>;
  unsubscribe(request: TokenRequest): Promise<Empty>;
}

export interface ClientWeatherCityExists {
  cityExists(request: CityExistsRequest): Promise<CityExistsResponse>;
}

export interface ClientSendConfirmationEmail {
  sendConfirmation(request: SendConfirmationRequest): Promise<Empty>;
}

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @Inject(SubscriptionClientDiTokens.SUBSCRIPTION_CLIENT_SERVICE)
    private readonly subscriptionClient: SubscriptionClient,

    @Inject(WeatherClientDiTokens.WEATHER_CLIENT_SERVICE)
    private readonly weatherClient: ClientWeatherCityExists,

    @Inject(EmailClientDiTokens.EMAIL_CLIENT_SERVICE)
    private readonly emailClient: ClientSendConfirmationEmail
  ) {}

  async subscribe(dto: SubscriptionDto): Promise<MessageDto> {
    const { exists: cityExists } = await this.weatherClient.cityExists({
      city: dto.city,
    });
    if (!cityExists) throw new NotFoundException(Errors.CITY_NOT_FOUND);
    const { token } = await this.subscriptionClient.create(dto);
    await this.emailClient.sendConfirmation({ email: dto.email, token });
    return { message: SubscriptionMessages.SUBSCRIPTION_SUCCESS };
  }

  async confirm(token: string): Promise<MessageDto> {
    await this.subscriptionClient.confirm({ token });
    return { message: SubscriptionMessages.SUBSCRIPTION_CONFIRMED };
  }

  async unsubscribe(token: string): Promise<MessageDto> {
    await this.subscriptionClient.unsubscribe({ token });
    return { message: SubscriptionMessages.UNSUBSCRIBED_SUCCESSFULLY };
  }
}
