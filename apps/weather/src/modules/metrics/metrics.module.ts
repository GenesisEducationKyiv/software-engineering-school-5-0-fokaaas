import { Global, Module } from '@nestjs/common';
import { MetricsDiTokens } from './constants/di-tokens.const';
import { MetricsService } from './metrics.service';

@Global()
@Module({
  providers: [
    {
      provide: MetricsDiTokens.METRICS_SERVICE,
      useClass: MetricsService,
    },
  ],
  exports: [MetricsDiTokens.METRICS_SERVICE],
})
export class MetricsModule {}
