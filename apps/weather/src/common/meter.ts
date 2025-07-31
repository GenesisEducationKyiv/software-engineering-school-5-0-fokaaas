import { Meter, metrics } from '@opentelemetry/api';

export const meter: Meter = metrics.getMeter('weather');
