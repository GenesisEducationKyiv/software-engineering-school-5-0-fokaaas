import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricProviders } from './metric-providers';
import {
  PrometheusModule,
  PrometheusUseFactoryOptions,
} from '@willsoto/nestjs-prometheus';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { MetricsDiTokens } from './constants/di-tokens.const';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrometheusModule.registerAsync({
      useFactory(config: ConfigService): PrometheusUseFactoryOptions {
        return {
          defaultMetrics: {
            enabled: true,
          },
          pushgateway: {
            url: config.getOrThrow<string>('metrics.gatewayUrl'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: MetricsDiTokens.METRICS_SERVICE,
      useClass: MetricsService,
    },
    ...MetricProviders,
  ],
  exports: [MetricsDiTokens.METRICS_SERVICE],
})
export class MetricsModule {}
