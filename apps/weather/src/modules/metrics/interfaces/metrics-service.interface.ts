export type Disposable = {
  [Symbol.dispose](): void;
};

export interface MetricsServiceInterface {
  incCacheHit(method: string): void;
  incCacheMiss(method: string): void;
  measureResponseTime(method: string): Disposable;
}
