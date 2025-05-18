export type GrpcToObservable<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<infer R>
    ? (...args: Parameters<T[K]>) => Observable<R>
    : T[K];
};
