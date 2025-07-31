import { Logger } from '@nestjs/common';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource, resourceFromAttributes } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { TelemetryServiceInterface } from './interfaces/telemetry-service.interface';
import { ParentBasedSampler, Sampler } from '@opentelemetry/sdk-trace-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';
import {
  BatchLogRecordProcessor,
  ConsoleLogRecordExporter,
  LoggerProvider,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { logs } from '@opentelemetry/api-logs';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';

export type TelemetryConfig = {
  serviceName: string;
  serviceVersion: string;
  sampler?: Sampler;
};

export class TelemetryService implements TelemetryServiceInterface {
  private readonly logger = new Logger(TelemetryService.name);
  private sdk: NodeSDK;

  constructor(private readonly config: TelemetryConfig) {}

  start() {
    const resource = resourceFromAttributes({
      [ATTR_SERVICE_NAME]: this.config.serviceName,
      [ATTR_SERVICE_VERSION]: this.config.serviceVersion,
    });
    this.setupLogger(resource);
    this.sdk = this.createSdk(resource);
    this.sdk.start();
    this.logger.log(`[OTel] Initialized for "${this.config.serviceName}"`);
  }

  private setupLogger(resource: Resource): void {
    const exporter = new OTLPLogExporter();

    const consoleExporter = new ConsoleLogRecordExporter();

    const loggerProvider = new LoggerProvider({
      resource,
      processors: [
        new BatchLogRecordProcessor(exporter),
        new SimpleLogRecordProcessor(consoleExporter),
      ],
    });

    logs.setGlobalLoggerProvider(loggerProvider);
  }

  private createSdk(resource: Resource): NodeSDK {
    return new NodeSDK({
      traceExporter: new OTLPTraceExporter(),
      metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(),
      }),
      resource,
      sampler:
        this.config.sampler &&
        new ParentBasedSampler({
          root: this.config.sampler,
        }),
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-grpc': { enabled: true },
          '@opentelemetry/instrumentation-nestjs-core': { enabled: true },
        }),
        new NestInstrumentation(),
      ],
    });
  }
}
