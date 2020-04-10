const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  bail: true,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/app/**",
  ],
  coverageDirectory: "__tests__/coverage",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/src/" }),
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/src/**/*.spec.ts"
  ],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testTimeout: 30000,
};
