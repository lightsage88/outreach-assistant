
/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  clearMocks: true,

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
    "^.+\\.m?js$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2022",
          parser: {
            syntax: "ecmascript",
          },
        },
        module: {
          type: "commonjs",
        },
      },
    ],
  },

  transformIgnorePatterns: [
    "node_modules/(?!(marked)/)",
  ],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|scss|sass)$": "<rootDir>/src/tests/styleMock.cjs",
  },

  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts",
  ],
};

module.exports = config;
