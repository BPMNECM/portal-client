// 'jest.config.js' at the root of project - 'portal-client/jest.config.js'
const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './'
});

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom', // Make sure this line points to the correct environment
    moduleDirectories: ['node_modules', '<rootDir>/'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    },
    testTimeout: 10000 // Increase timeout for async tests
};

module.exports = createJestConfig(customJestConfig);
