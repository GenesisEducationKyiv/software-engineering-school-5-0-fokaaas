import { Injectable } from '@nestjs/common';
import { HttpClientServiceInterface } from './interfaces/http-client-service.interface';

@Injectable()
export class HttpClientService implements HttpClientServiceInterface {
  get(url: string, options?: RequestInit): Promise<Response> {
    return fetch(url, options);
  }
}
