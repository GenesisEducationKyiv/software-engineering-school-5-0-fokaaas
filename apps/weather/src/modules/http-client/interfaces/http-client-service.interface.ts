export interface HttpClientServiceInterface {
  get(url: string, options?: RequestInit): Promise<Response>;
}
