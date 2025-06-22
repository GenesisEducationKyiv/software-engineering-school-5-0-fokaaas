import { createHandlers } from './create-handlers';
import { setupServer } from 'msw/node';

export const setupMswServer = async () => {
  const { WEATHER_API_URL } = process.env;
  return setupServer(...createHandlers(WEATHER_API_URL ?? ''));
};
