export type GrpcToObservable<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => Promise<infer R>
    ? (...args: A) => Observable<R>
    : T[K];
};

export type ExceptionResponse = {
  message: string | string[];
};
