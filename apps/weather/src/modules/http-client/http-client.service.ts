import { Injectable } from '@nestjs/common';

export interface IHttpClientService {
  get(url: string, options?: RequestInit): Promise<Response>;
}

@Injectable()
export class HttpClientService implements IHttpClientService {
  get(url: string, options?: RequestInit): Promise<Response> {
    return fetch(url, options);
  }
}
