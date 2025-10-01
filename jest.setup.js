// Ensure a non-opaque origin very early
try {
    // In jsdom, window.location is configurable, but read-only in browsers
    const desired = new URL('http://localhost/');
    const current =
        typeof window !== 'undefined' && window.location
            ? window.location
            : null;
    if (!current || current.origin === 'null' || current.origin === '') {
        Object.defineProperty(window, 'location', {
            value: desired,
            configurable: true,
        });
    }
} catch (_) {}

// Provide a safe localStorage even if jsdom exposes a throwing getter under opaque origins
(function ensureLocalStorage() {
    if (typeof window === 'undefined') return;
    let needsPatch = false;
    try {
        const probeKey = '__lg_probe__';
        window.localStorage.setItem(probeKey, '1');
        window.localStorage.removeItem(probeKey);
    } catch (e) {
        needsPatch = true;
    }
    if (!needsPatch) return;

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
    Object.defineProperty(window, 'localStorage', {
        value: api,
        configurable: true,
    });
})();
