// Configure Zod for strict Content Security Policy (skips new Function() JIT eval probe)
(globalThis as unknown as { __zod_globalConfig?: { jitless?: boolean } }).__zod_globalConfig = {
    jitless: true,
};
