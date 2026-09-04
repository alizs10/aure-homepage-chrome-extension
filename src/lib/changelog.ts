import { STORAGE_KEYS } from '@/constants/storage_keys';
import { marked } from 'marked';

const modules = import.meta.glob<string>('/src/components/features/updates/changelog/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
});

export interface ChangelogEntry {
    version: string;
    date: string;
    title: string;
    preview: string;       // 🌟 NEW: Short snippet for the list view
    contentHtml: string;
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: raw };

    const meta: Record<string, string> = {};
    match[1].split(/\r?\n/).forEach((line) => {
        const idx = line.indexOf(':');
        if (idx > -1) {
            const key = line.slice(0, idx).trim();
            const value = line.slice(idx + 1).trim();
            if (key) meta[key] = value;
        }
    });

    return { meta, body: match[2] };
}

// 🌟 Extract a plain-text preview from rendered HTML for the list item
function extractPreview(html: string): string {
    const text = html
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (text.length <= 140) return text;
    return text.slice(0, 140).trim() + '…';
}

function compareVersions(a: string, b: string): number {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const da = pa[i] ?? 0;
        const db = pb[i] ?? 0;
        if (da > db) return 1;
        if (da < db) return -1;
    }
    return 0;
}

export const changelog: ChangelogEntry[] = Object.entries(modules)
    .map(([path, raw]) => {
        const { meta, body } = parseFrontmatter(raw);
        const versionFromPath = path.match(/(\d+\.\d+\.\d+)\.md$/)?.[1] ?? '0.0.0';
        const contentHtml = marked.parse(body, { async: false }) as string;

        return {
            version: meta.version || versionFromPath,
            date: meta.date || '',
            title: meta.title || `Version ${meta.version || versionFromPath}`,
            preview: extractPreview(contentHtml),
            contentHtml,
        };
    })
    .sort((a, b) => compareVersions(b.version, a.version));

export const latestVersion = changelog[0]?.version ?? '0.0.0';

export const LAST_SEEN_KEY = STORAGE_KEYS.lastSeenChangelog;

export async function getLastSeenVersion(): Promise<string | null> {
    const result = await chrome.storage.local.get(LAST_SEEN_KEY);
    return (result[LAST_SEEN_KEY] as string) ?? null;
}

export async function setLastSeenVersion(version: string): Promise<void> {
    await chrome.storage.local.set({ [LAST_SEEN_KEY]: version });
}

export function hasNewUpdate(lastSeen: string | null): boolean {
    if (!lastSeen) return changelog.length > 0;
    return compareVersions(latestVersion, lastSeen) > 0;
}