import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { initTelemetry } from '@shared/modules/telemetry/utils/init-telemetry';
import { TelemetryLogger } from '@shared/modules/telemetry/telemetry.logger';
import { GrpcExceptionFilter } from '@shared/common/filters/grpc-exception.filter';
import { meter } from './common/meter';

async function bootstrap() {
  initTelemetry({
    serviceName: 'subscription',
    serviceVersion: '1.0.0',
  });

  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get<ConfigService>(ConfigService);

  const logLevel = configService.getOrThrow<string>('logLevel');
  const port = configService.get<number>('port');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'subscription',
        protoPath: 'libs/proto/subscription.proto',
        url: `0.0.0.0:${port}`,
      },
    }
  );

  app.useGlobalFilters(new GrpcExceptionFilter(meter));

  app.useLogger(new TelemetryLogger(logLevel));

  await app.listen();

  Logger.log({ msg: 'Application started', port });
}

void bootstrap();
