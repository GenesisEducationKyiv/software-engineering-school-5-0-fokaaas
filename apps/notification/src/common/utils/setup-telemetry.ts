import { initTelemetry } from '@shared/modules/telemetry/utils/init-telemetry';
import { version } from '../../../package.json';
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-node';

initTelemetry({
  serviceName: 'notification',
  serviceVersion: version,
  sampler: new TraceIdRatioBasedSampler(0.1),
});
