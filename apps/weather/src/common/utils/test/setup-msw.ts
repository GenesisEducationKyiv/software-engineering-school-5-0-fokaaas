/// <reference types="jest" />

import { setupServer } from 'msw/node';
import handlers from './handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterAll(() => server.close());
