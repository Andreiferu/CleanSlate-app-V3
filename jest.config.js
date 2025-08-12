module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module mapping pentru absolute imports
  moduleNameMapping: {
    '^@/(.*): '<rootDir>/$1',
    '^@/components/(.*): '<rootDir>/components/$1',
    '^@/hooks/(.*): '<rootDir>/hooks/$1',
    '^@/services/(.*): '<rootDir>/services/$1',
    '^@/utils/(.*): '<rootDir>/utils/$1',
    '^@/context/(.*): '<rootDir>/context/$1'
  },

  // Coverage configuration
  collectCoverageFrom: [
    'components/**/*.{js,jsx}',
    'hooks/**/*.{js,jsx}',
    'services/**/*.{js,jsx}',
    'utils/**/*.{js,jsx}',
    'context/**/*.{js,jsx}',
    '!**/*.test.{js,jsx}',
    '!**/node_modules/**',
    '!**/*.config.js',
    '!**/coverage/**'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    './services/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Test patterns
  testMatch: [
    '**/__tests__/**/*.{js,jsx}',
    '**/?(*.)+(spec|test).{js,jsx}'
  ],

  // Transform configuration
  transform: {
    '^.+\\.(js|jsx): ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'json'],

  // Test timeout
  testTimeout: 10000,

  // Cleanup after each test
  restoreMocks: true,
  clearMocks: true,

  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/'
  ],

  // Globals
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};
