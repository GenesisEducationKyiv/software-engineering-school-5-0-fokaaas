import { Injectable } from '@nestjs/common';

export interface HttpClient {
  get(url: string, options?: RequestInit): Promise<Response>;
}

@Injectable()
export class HttpClientService implements HttpClient {
  get(url: string, options?: RequestInit): Promise<Response> {
    return fetch(url, options);
  }
}
