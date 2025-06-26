import { appendFile } from 'fs/promises';

export function LogApiResponse(provider: string) {
  return function (
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<Response> {
      const logFile = 'logs/weather-providers.log';
      const timestamp = new Date().toISOString();

      try {
        const response = await originalMethod.apply(this, args);
        const clone = response.clone();
        const body = await clone.text();

        void appendFile(
          logFile,
          `[${timestamp}] ${provider} - Response: ${body}\n`
        );

        return response;
      } catch (err) {
        void appendFile(logFile, `[${timestamp}] ${provider} - Unavailable\n`);

        throw err;
      }
    };

    return descriptor;
  };
}
