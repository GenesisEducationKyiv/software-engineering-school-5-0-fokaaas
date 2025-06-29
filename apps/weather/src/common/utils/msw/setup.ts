/// <reference types="jest" />

import { createMockServer } from './create-mock-server';

export const mockServer = createMockServer();

beforeAll(() => {
  mockServer.start();
});

afterEach(() => {
  expect(mockServer.onUnhandledRequest).not.toHaveBeenCalled();
  mockServer.onUnhandledRequest.mockClear();

  mockServer.clearHandlers();
  mockServer.setExcludedUrls([]);
});

afterAll(() => {
  mockServer.stop();
});
