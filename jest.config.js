module.exports = {
    testEnvironment: '<rootDir>/jest.environment.js',
    setupFiles: ['<rootDir>/jest.setup.js'],
    roots: ['<rootDir>/src', '<rootDir>/test'],
    modulePathIgnorePatterns: [
        '<rootDir>/lightgallery-angular/',
        '<rootDir>/lightgallery-react/',
        '<rootDir>/lightgallery-vue/',
        '<rootDir>/lightgallery-lit/',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/lightgallery-angular/',
        '<rootDir>/lightgallery-react/',
        '<rootDir>/lightgallery-vue/',
        '<rootDir>/lightgallery-lit/',
    ],
    // Ensure ts-jest can pick up TS tests if used
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { isolatedModules: true } }],
    },
};
