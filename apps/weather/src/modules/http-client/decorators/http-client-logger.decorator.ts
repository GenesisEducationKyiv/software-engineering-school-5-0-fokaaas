import { appendFile } from 'fs/promises';
import { HttpClientServiceInterface } from '../interfaces/http-client-service.interface';

export class HttpClientLoggerDecorator implements HttpClientServiceInterface {
  constructor(
    private readonly client: HttpClientServiceInterface,
    private readonly domain: string,
    private readonly filePath: string
  ) {}

  async get(url: string, options?: RequestInit): Promise<Response> {
    return this.wrapWithLog(() => this.client.get(url, options));
  }

  private async wrapWithLog<T>(handler: () => Promise<T>): Promise<T> {
    const timestamp = new Date().toISOString();
    try {
      const response = await handler();
      if (response instanceof Response) {
        const body = await response.clone().text();
        void appendFile(
          this.filePath,
          `[${timestamp}] ${this.domain} - Response: ${body}\n`
        );
      }
      return response;
    } catch (err) {
      void appendFile(
        this.filePath,
        `[${timestamp}] ${this.domain} - Unavailable\n`
      );
      throw err;
    }
  }
}
