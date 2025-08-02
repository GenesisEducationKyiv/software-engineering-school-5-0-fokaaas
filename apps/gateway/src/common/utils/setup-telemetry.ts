import { initTelemetry } from '@shared/modules/telemetry/utils/init-telemetry';
import { version } from '../../../package.json';
import { PathBasedSampler } from '@shared/modules/telemetry/samplers/path-based.sampler';

initTelemetry({
  serviceName: 'gateway',
  serviceVersion: version,
  sampler: new PathBasedSampler([{ pathPrefix: '/api/weather', ratio: 0.1 }]),
});
