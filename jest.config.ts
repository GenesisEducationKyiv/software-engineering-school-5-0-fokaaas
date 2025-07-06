import nxPreset from '@nx/jest/preset';
import { Config } from 'jest';

const config: Config = {
  ...nxPreset,
  coverageDirectory: 'coverage',
  modulePathIgnorePatterns: ['<rootDir>/apps/*/dist/'],
  testEnvironment: 'node',
};

export default config;
