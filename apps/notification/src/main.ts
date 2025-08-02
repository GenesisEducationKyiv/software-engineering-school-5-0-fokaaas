import './common/utils/setup-telemetry';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { TelemetryLogger } from '@shared/modules/telemetry/telemetry.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow<number>('port');
  const logLevel = configService.getOrThrow<string>('logLevel');

  app.useLogger(new TelemetryLogger(logLevel));

  await app.listen(port);

  Logger.log({ msg: 'Application started', port });
}

void bootstrap();
