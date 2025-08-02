import { initTelemetry } from '@shared/modules/telemetry/utils/init-telemetry';
import { version } from '../../../package.json';

initTelemetry({
  serviceName: 'email',
  serviceVersion: version,
});
