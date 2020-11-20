module.exports = {
  verbose: true,
  rootDir: ".",
  roots: ["./src"],
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  runner: "jest-serial-runner",
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,ts}"
  ],
  coveragePathIgnorePatterns: [
    "app.ts",
    "webapp"
  ],
  setupFilesAfterEnv: [
    './src/__tests__/jest.setup.js'
  ],
  /*coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: -10
    }
  }*/
}