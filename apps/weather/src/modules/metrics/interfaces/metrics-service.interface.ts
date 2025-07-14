export interface MetricsServiceInterface {
  incCacheHit(method: string): void;
  incCacheMiss(method: string): void;
  createResponseTimer(method: string): { [Symbol.dispose]: () => void };
}
