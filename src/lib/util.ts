// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This function combines classes AND resolves Tailwind conflicts
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface OrderableItem {
    id: number;
    order: number;
}

export function getAdjacentSwap<T extends OrderableItem>(
    items: T[],
    id: number,
    direction: 'up' | 'down'
): {
    current: T;
    adjacent: T;
    updatedCurrent: T;
    updatedAdjacent: T;
    newItems: T[];
} | null {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return null;

    const current = items[index];
    const adjacent = items[targetIndex];

    const updatedCurrent = { ...current, order: adjacent.order };
    const updatedAdjacent = { ...adjacent, order: current.order };

    const newItems = items
        .map((item) => {
            if (item.id === id) return updatedCurrent;
            if (item.id === adjacent.id) return updatedAdjacent;
            return item;
        })
        .sort((a, b) => a.order - b.order);

    return {
        current,
        adjacent,
        updatedCurrent,
        updatedAdjacent,
        newItems,
    };
}