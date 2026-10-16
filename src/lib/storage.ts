import browser from 'webextension-polyfill';

export const storage = {
    async get<T>(key: string): Promise<T | null> {
        const result = await browser.storage.local.get(key);

        return (result[key] as T | undefined) ?? null;
    },

    async set(key: string, value: unknown) {
        await browser.storage.local.set({
            [key]: value,
        });
    },

    async remove(key: string) {
        await browser.storage.local.remove(key);
    },
};