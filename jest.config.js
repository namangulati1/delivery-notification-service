/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  // Automatically mock modules that are often side-effect-heavy or external
  // You've already manually mocked many in app.test.ts, this can be a safety net
  // or reduce boilerplate if you have common patterns.
  // moduleNameMapper: {
  //   // Example: '^src/(.*)$': '<rootDir>/src/$1',
  // },
  // Indicates which provider should be used to instrument code for coverage
  // coverageProvider: "babel", // or "v8"

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  // setupFilesAfterEnv: ['./jest.setup.js'],
};
