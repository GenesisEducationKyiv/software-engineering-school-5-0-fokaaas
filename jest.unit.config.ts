import type { Config } from 'jest';
import baseConfig from './jest.base.config';

const config: Config = {
  ...baseConfig,
  testMatch: ['**/*.spec.ts'],
  testEnvironment: 'jest-fixed-jsdom',
};

export default config;
