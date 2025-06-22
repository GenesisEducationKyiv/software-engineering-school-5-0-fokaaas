import { appendFileSync } from 'fs';

export function LogApiResponse(provider: string) {
  return function (
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<Response> {
      const logFile = 'logs/weather-providers.log';

      try {
        const response = await originalMethod.apply(this, args);
        const clone = response.clone();
        const body = await clone.text();

        appendFileSync(logFile, `${provider} - Response: ${body}\n`);
        return response;
      } catch (err) {
        appendFileSync(logFile, `${provider} - Unavailable\n`);
        throw err;
      }
    };

    return descriptor;
  };
}
