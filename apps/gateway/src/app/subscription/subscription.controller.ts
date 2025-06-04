import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscribeBody } from './body/subscribe.body';
import { UnsubscribePath } from './path/unsubscribe.path';
import { TokenPath } from './path/token.path';

@Controller()
export class SubscriptionController {
  constructor (private subscriptionService: SubscriptionService) {}

  @Post('/subscribe')
  subscribe (@Body() body: SubscribeBody) {
    return this.subscriptionService.subscribe(body);
  }

  @Get('/confirm/:token')
  confirm (@Param() param: TokenPath) {
    return this.subscriptionService.confirm(param);
  }

  @Get('/unsubscribe/:token')
  unsubscribe (@Param() param: UnsubscribePath) {
    return this.subscriptionService.unsubscribe(param);
  }
}
