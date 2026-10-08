import type { WidgetId } from '@/types';

// Widget weight map: how many grid units each widget occupies
export const WIDGET_WEIGHTS: Record<WidgetId, number> = {
    "notes-and-checklists": 2,
    "calendar": 2,
    "pomodoro": 2,
    "progresses": 2,
    "mood-tracker": 1,
    "pet-house": 1,
    "counters": 1,
};

export type ViewportSize = 'mobile' | 'tablet' | 'desktop';

// Base storage format (desktop-based coordinates)
export const GRID_DIMENSIONS = {
    columns: 3,
    rows: 2,
} as const;

// Viewport-specific grid layouts (all have 6 cells per page)
export const GRID_CONFIGS = {
    mobile: { columns: 1, rows: 6 },
    tablet: { columns: 2, rows: 3 },
    desktop: { columns: 3, rows: 2 },
} as const;

/**
 * Maps a stored position (desktop coordinates) to viewport-specific coordinates.
 * Preserves storage format while enabling responsive display.
 */
export function mapPositionToViewport(
    column: number,
    row: number,
    size: 1 | 2,
    viewport: ViewportSize
): { column: number; row: number; size: 1 | 2 } {
    const config = GRID_CONFIGS[viewport];

    // Convert stored desktop position to slot index (0-5)
    const desktopSlot = column * GRID_DIMENSIONS.rows + row;

    // Map slot to viewport grid coordinates
    let newCol = Math.floor(desktopSlot / config.rows);
    let newRow = desktopSlot % config.rows;
    const newSize = size;

    // Handle 2-unit widgets that would overflow the grid bounds
    if (newSize === 2 && newRow > config.rows - 2) {
        newRow = config.rows - 2; // Move up to fit within bounds
    }

    // Ensure column is within bounds
    if (newCol >= config.columns) {
        newCol = config.columns - 1;
    }

    return { column: newCol, row: newRow, size: newSize };
}