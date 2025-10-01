// Force a non-opaque origin before anything else touches window.location/localStorage
(function ensureOrigin() {
    try {
        const href = 'http://localhost/';
        // In jsdom, we can safely set location by replacing the property on the Window instance
        Object.defineProperty(window, 'location', {
            value: new URL(href),
            configurable: true,
        });
    } catch (_) {}
})();

// Always provide a non-throwing localStorage shim
(function installLocalStorageShim() {
    if (typeof window === 'undefined') return;
    let store = {};
    const api = {
        getItem: (k) =>
            Object.prototype.hasOwnProperty.call(store, k)
                ? String(store[k])
                : null,
        setItem: (k, v) => {
            store[k] = String(v);
        },
        removeItem: (k) => {
            delete store[k];
        },
        clear: () => {
            store = {};
        },
        key: (i) => Object.keys(store)[i] || null,
        get length() {
            return Object.keys(store).length;
        },
    };
    try {
        Object.defineProperty(window, 'localStorage', {
            value: api,
            configurable: true,
        });
    } catch (_) {
        // Fallback, just assign if defineProperty fails for any reason
        // @ts-ignore
        window.localStorage = api;
    }
})();
