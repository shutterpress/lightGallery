// Custom JSDOM environment that guarantees a non-opaque origin
const JSDOMEnvironment = require('jest-environment-jsdom');

class LightGalleryEnvironment extends JSDOMEnvironment {
    constructor(config, context) {
        // Ensure url is always provided to jsdom
        const cfg = {
            ...config,
            testEnvironmentOptions: {
                ...(config.testEnvironmentOptions || {}),
                url: 'http://localhost/',
            },
        };
        super(cfg, context);
    }
}

module.exports = LightGalleryEnvironment;
