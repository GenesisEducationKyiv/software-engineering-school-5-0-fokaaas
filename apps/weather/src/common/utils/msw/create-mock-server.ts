import type { RequestHandler } from 'msw';
import { setupServer } from 'msw/node';

export function createMockServer() {
  const server = setupServer();
  let excludedUrls: string[] = [];
  const onUnhandledRequest = jest.fn();

  return {
    onUnhandledRequest,
    start() {
      server.listen({
        onUnhandledRequest(req, print) {
          if (!excludedUrls.includes(req.url)) {
            console.log('---- Unhandled request ----');
            console.log(`${req.method}: ${req.url}`);

            onUnhandledRequest();
            print.error();
          }
        },
      });
    },
    setExcludedUrls(urls: string[]) {
      excludedUrls = urls;
    },
    clearHandlers() {
      server.resetHandlers();
    },
    addHandlers(...handlers: RequestHandler[]) {
      server.use(...handlers);
    },
    stop() {
      server.close();
    },
  };
}
