module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@ecommerce/shared-types$': '<rootDir>/libs/shared-types/src/index.ts',
    '^@ecommerce/shared-ui$': '<rootDir>/libs/shared-ui/src/index.ts',
    '^@ecommerce/events$': '<rootDir>/libs/events/src/index.ts',
    '^@ecommerce/state$': '<rootDir>/libs/state/src/index.ts',
    '^@ecommerce/utilities$': '<rootDir>/libs/utilities/src/index.ts',
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/mocks/styleMock.js'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.base.json'
    }]
  },
  testMatch: [
    '<rootDir>/libs/**/*.test.ts',
    '<rootDir>/libs/**/*.test.tsx',
    '<rootDir>/apps/**/*.test.ts',
    '<rootDir>/apps/**/*.test.tsx'
  ],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'libs/**/*.{ts,tsx}',
    'apps/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!apps/**/bootstrap.tsx',
    '!apps/**/index.ts'
  ]
};
