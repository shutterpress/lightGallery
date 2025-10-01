module.exports = {
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        url: 'http://localhost/',
    },
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
};
