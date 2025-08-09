import { TelemetryConfig, TelemetryService } from '../telemetry.service';

export function initTelemetry(config: TelemetryConfig): TelemetryService {
  const telemetryService = new TelemetryService(config);
  telemetryService.start();
  return telemetryService;
}
