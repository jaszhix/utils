module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['jest-extended'],
  verbose: true,
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  automock: false,
};
