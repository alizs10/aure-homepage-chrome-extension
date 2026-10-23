export const isFirefox =
    import.meta.env.VITE_TARGET_BROWSER === 'firefox' ||
    (typeof window !== 'undefined' && window.location.protocol === 'moz-extension:') ||
    (typeof navigator !== 'undefined' && /firefox|fxios|fxdeved/i.test(navigator.userAgent));

export const isChrome = !isFirefox;
