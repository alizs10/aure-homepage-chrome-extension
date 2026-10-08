import { useDraggable } from '@dnd-kit/core';
import { BetterTypography } from '@/components/common/BetterTypography';
import { WIDGET_WEIGHTS, type ViewportSize } from '@/constants/widget-weights';
import type { WidgetId } from '@/types';
import { useMemo } from 'react';

const WIDGET_LABELS: Record<WidgetId, string> = {
    "notes-and-checklists": "Notes & Tasks",
    "calendar": "Calendar",
    "pomodoro": "Pomodoro",
    "progresses": "Progresses",
    "mood-tracker": "Mood Tracker",
    "pet-house": "Pet House",
    "counters": "Counters",
};

const HEIGHT_1UNIT = 12;
const HEIGHT_2UNIT = 24.75;

interface DraggableWidgetProps {
    id: WidgetId;
}

function DraggableWidget({ id }: DraggableWidgetProps) {
    const size = WIDGET_WEIGHTS[id] as 1 | 2;

    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `palette-${id}`,
        data: {
            type: 'palette',
            widgetId: id,
            size,
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
                w-full rounded-2xl liquid-glass
                flex items-center justify-center p-2
                cursor-grab active:cursor-grabbing
                transition-opacity duration-150
                ${size === 2 ? 'aspect-17/24.75' : 'aspect-17/12'}
            `}
        >
            <BetterTypography variant="xs" weight="medium" className="text-center leading-tight whitespace-break-spaces">
                {WIDGET_LABELS[id]}
            </BetterTypography>
        </div>
    );
}

interface WidgetPaletteProps {
    availableWidgets: WidgetId[];
    viewportSize?: ViewportSize;
}

// Column count per viewport: mobile=2, tablet=3, desktop=2
const COLUMN_COUNT: Record<ViewportSize, number> = {
    mobile: 3,
    tablet: 5,
    desktop: 2,
};

export default function WidgetPalette({ availableWidgets, viewportSize = 'desktop' }: WidgetPaletteProps) {
    const numColumns = COLUMN_COUNT[viewportSize];

    // Distribute items into N columns for masonry layout with left-to-right ordering.
    // Each item goes to the shortest column; ties go to the leftmost column.
    const columns = useMemo(() => {
        const cols: WidgetId[][] = Array.from({ length: numColumns }, () => []);
        const heights: number[] = Array(numColumns).fill(0);

        for (const widgetId of availableWidgets) {
            const size = WIDGET_WEIGHTS[widgetId] as 1 | 2;
            const itemHeight = size === 2 ? HEIGHT_2UNIT : HEIGHT_1UNIT;

            // Find the column with the shortest height (leftmost on tie)
            let shortestIdx = 0;
            let shortestHeight = heights[0];
            for (let i = 1; i < numColumns; i++) {
                if (heights[i] < shortestHeight) {
                    shortestHeight = heights[i];
                    shortestIdx = i;
                }
            }

            cols[shortestIdx].push(widgetId);
            heights[shortestIdx] += itemHeight;
        }

        return cols;
    }, [availableWidgets, numColumns]);

    const gapClass = numColumns === 3 ? 'gap-0.5' : 'gap-1';

    return (
        <div className="h-full flex flex-col p-4 rounded-3xl liquid-glass w-full max-w-full overflow-x-clip">
            <div className="flex flex-col gap-y-1">
                <BetterTypography variant="sm" weight="semibold">
                    Available Widgets
                </BetterTypography>
                <BetterTypography variant="xs" className="text-muted-foreground">
                    Drag to the grid to place
                </BetterTypography>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide mt-4">
                {availableWidgets.length === 0 ? (
                    <div className="h-full flex-center">
                        <BetterTypography variant="xs" className="text-muted-foreground text-center">
                            All widgets are placed
                        </BetterTypography>
                    </div>
                ) : (
                    <div className={`flex ${gapClass}`}>
                        {columns.map((col, idx) => (
                            <div key={idx} className={`flex-1 flex flex-col ${gapClass}`}>
                                {col.map(widgetId => (
                                    <DraggableWidget key={widgetId} id={widgetId} />
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}