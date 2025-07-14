import { Module } from '@nestjs/common';
import { HttpClientService } from './http-client.service';
import { HttpClientDiTokens } from './constants/di-tokens.const';

@Module({
  providers: [
    {
      provide: HttpClientDiTokens.HTTP_CLIENT_SERVICE,
      useClass: HttpClientService,
    },
  ],
  exports: [HttpClientDiTokens.HTTP_CLIENT_SERVICE],
})
export class HttpClientModule {}
