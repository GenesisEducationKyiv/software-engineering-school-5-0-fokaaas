import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { SubscribeBody } from './body/subscribe.body';
import { TokenPath } from './path/token.path';
import { SubscriptionDiTokens } from './constants/di-tokens.const';
import type { SubscriptionServiceInterface } from './interfaces/subscription-service.interface';

@Controller()
export class SubscriptionController {
  constructor(
    @Inject(SubscriptionDiTokens.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: SubscriptionServiceInterface
  ) {}

  @Post('/subscribe')
  async subscribe(@Body() body: SubscribeBody) {
    const message = await this.subscriptionService.subscribe(body);
    return { message };
  }

  @Get('/confirm/:token')
  async confirm(@Param() param: TokenPath) {
    const message = await this.subscriptionService.confirm(param.token);
    return { message };
  }

  @Get('/unsubscribe/:token')
  async unsubscribe(@Param() param: TokenPath) {
    const message = await this.subscriptionService.unsubscribe(param.token);
    return { message };
  }
}
