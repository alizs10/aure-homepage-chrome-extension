export const STORAGE_KEYS = {
    settings: 'settings',
    lastSeenChangelog: 'aure_last_seen_changelog',
}

// LocalStorage keys (session-based, resets on browser restart)
export const LOCAL_STORAGE_KEYS = {
    selectedPage: 'aure_selected_page',
} as const;