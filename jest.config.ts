import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest', // Use ts-jest for TypeScript
  testEnvironment: 'jsdom', // Use 'jsdom' for React testing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TypeScript and TSX files
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'], // Match test files
};

export default config;