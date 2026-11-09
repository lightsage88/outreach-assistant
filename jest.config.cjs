
/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  clearMocks: true,
  moduleNameMapper: {
  "^@/(.*)$": "<rootDir>/src/$1",
  "\\.(css|scss|sass)$": "<rootDir>/src/tests/styleMock.cjs",
},
setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
};

module.exports = config;
