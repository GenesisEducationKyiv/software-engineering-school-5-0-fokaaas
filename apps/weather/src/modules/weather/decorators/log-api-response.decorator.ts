import { appendFile } from 'fs/promises';

/**
 * Decorator to log API responses for weather providers.
 * It logs the response body or an error message if the request fails.
 *
 * @param domain - The domain of the weather provider.
 * @returns A method decorator that logs the API response.
 */
export function LogApiResponse(domain: string) {
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
          `[${timestamp}] ${domain} - Response: ${body}\n`
        );

        return response;
      } catch (err) {
        void appendFile(logFile, `[${timestamp}] ${domain} - Unavailable\n`);

        throw err;
      }
    };

    return descriptor;
  };
}
