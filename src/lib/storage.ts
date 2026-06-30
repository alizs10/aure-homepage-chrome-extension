export const storage = {
    async get<T>(key: string): Promise<T | null> {
        const result = await chrome.storage.local.get(key);

        return (result[key] as T | undefined) ?? null;
    },

    async set(key: string, value: unknown) {
        await chrome.storage.local.set({
            [key]: value,
        });
    },

    async remove(key: string) {
        await chrome.storage.local.remove(key);
    },
};