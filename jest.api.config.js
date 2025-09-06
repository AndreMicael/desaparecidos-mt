const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/app/api/__tests__/**/*.test.ts',
    '<rootDir>/src/app/api/**/*.test.ts'
  ],
  collectCoverageFrom: [
    'src/app/api/**/*.{js,ts}',
    '!src/app/api/**/*.d.ts',
    '!src/app/api/__tests__/**',
  ],
  coverageDirectory: 'coverage/api',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 10000,
  verbose: true,
  // Mock do fetch global para testes
  setupFiles: ['<rootDir>/jest.api.setup.js'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
