import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { SubscribeBody } from './body/subscribe.body';
import { TokenPath } from './path/token.path';
import { SubscriptionDto } from './dto/subscription.dto';
import { MessageDto } from './dto/message.dto';
import { SubscriptionDiTokens } from './constants/di-tokens.const';

export interface ISubscriptionService {
  subscribe(dto: SubscriptionDto): Promise<MessageDto>;
  confirm(token: string): Promise<MessageDto>;
  unsubscribe(token: string): Promise<MessageDto>;
}

@Controller()
export class SubscriptionController {
  constructor(
    @Inject(SubscriptionDiTokens.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService
  ) {}

  @Post('/subscribe')
  subscribe(@Body() body: SubscribeBody) {
    return this.subscriptionService.subscribe(body);
  }

  @Get('/confirm/:token')
  confirm(@Param() param: TokenPath) {
    return this.subscriptionService.confirm(param.token);
  }

  @Get('/unsubscribe/:token')
  unsubscribe(@Param() param: TokenPath) {
    return this.subscriptionService.unsubscribe(param.token);
  }
}
