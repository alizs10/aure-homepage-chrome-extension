// src/components/home/customizer/LayoutGrid.tsx

import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import { GRID_DIMENSIONS } from '@/constants/widget-weights';
import type { WidgetId, WidgetPosition } from '@/types';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useLayoutEffect, useRef } from 'react';

const WIDGET_LABELS: Record<WidgetId, string> = {
    "notes-and-checklists": "Notes & Tasks",
    "calendar": "Calendar",
    "pomodoro": "Pomodoro",
    "progresses": "Progresses",
    "mood-tracker": "Mood Tracker",
    "pet-house": "Pet House",
    "counters": "Counters",
};

export interface CellSize {
    width: number;
    height: number;
    height2Unit: number;
}

interface DropZoneProps {
    id: string;
    column: number;
    row: number;
    rowSpan: 1 | 2;
    isOver: boolean;
    canDrop: boolean;
    hasWidget: boolean;
    isHidden: boolean;
    children?: React.ReactNode;
}

function DropZone({
    id,
    column,
    row,
    rowSpan,
    isOver,
    canDrop,
    hasWidget,
    isHidden,
    children,
}: DropZoneProps) {
    const { setNodeRef } = useDroppable({ id });

    const borderClass = isOver
        ? canDrop
            ? 'border-2 border-dashed border-primary bg-primary/10'
            : 'border-2 border-dashed border-destructive bg-destructive/10'
        : hasWidget
            ? 'border-0 bg-transparent'
            : 'border-2 border-dashed border-border/50 bg-background/5';

    return (
        <div
            ref={setNodeRef}
            className={`
                relative rounded-3xl
                flex items-center justify-center overflow-hidden
                ${borderClass}
                ${isHidden ? 'invisible pointer-events-none' : ''}
            `}
            style={{
                gridColumn: column + 1,
                gridRow: row + 1,
                gridRowEnd: rowSpan === 2 ? 'span 2' : undefined,
            }}
        >
            {!isHidden && children}
        </div>
    );
}

interface DraggablePlacedWidgetProps {
    position: WidgetPosition;
    page: number;
    onRemove: () => void;
}

function DraggablePlacedWidget({
    position,
    page,
    onRemove,
}: DraggablePlacedWidgetProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: `grid-${page}-${position.column}-${position.row}-${position.widgetId}`,
        data: {
            type: 'grid',
            widgetId: position.widgetId,
            size: position.size,
            fromPage: page,
            fromColumn: position.column,
            fromRow: position.row,
        },
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Translate.toString(transform),
                opacity: isDragging ? 0 : 1,
                visibility: isDragging ? 'hidden' as const : 'visible' as const,
            }}
            {...listeners}
            {...attributes}
            className="relative w-full h-full p-4 flex flex-col cursor-grab active:cursor-grabbing rounded-3xl liquid-glass"
        >
            <div className="flex-1 flex flex-col justify-center">
                <BetterTypography variant="sm" weight="medium">
                    {WIDGET_LABELS[position.widgetId]}
                </BetterTypography>
            </div>

            <Button
                size="icon-xs"
                variant="destructive"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute top-2 right-2 z-10"
            >
                ×
            </Button>
        </div>
    );
}

interface LayoutGridProps {
    currentPage: number;
    positions: WidgetPosition[];
    onRemoveWidget: (widgetId: WidgetId, page: number) => void;
    canPlaceWidget: (widgetId: WidgetId, page: number, column: number, row: number) => boolean;
    canMoveOrSwap: (
        widgetId: WidgetId,
        fromPage: number,
        toPage: number,
        column: number,
        row: number
    ) => boolean;
    canAddOrSwap: (
        widgetId: WidgetId,
        page: number,
        column: number,
        row: number
    ) => boolean;
    activeWidgetId: WidgetId | null;
    activeWidgetSize: number | null;
    activeWidgetFromPage: number | null;
    activeWidgetFromColumn: number | null;
    activeWidgetFromRow: number | null;
    overDropZoneId: string | null;
    onCellSizeChange?: (size: CellSize) => void;
}

export default function LayoutGrid({
    currentPage,
    positions,
    onRemoveWidget,
    canMoveOrSwap,
    canAddOrSwap,
    activeWidgetId,
    activeWidgetSize,
    activeWidgetFromPage,
    activeWidgetFromColumn,
    activeWidgetFromRow,
    overDropZoneId,
    onCellSizeChange,
}: LayoutGridProps) {
    const pagePositions = positions.filter(p => p.page === currentPage);
    const gridRef = useRef<HTMLDivElement>(null);
    const lastMeasuredSizeRef = useRef<{ width: number; height: number } | null>(null);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        isDraggingRef.current = activeWidgetId !== null;
    }, [activeWidgetId]);

    useLayoutEffect(() => {
        const el = gridRef.current;
        if (!el || !onCellSizeChange) return;

        const measure = () => {
            if (isDraggingRef.current) return;

            const containerWidth = el.offsetWidth;
            const containerHeight = el.offsetHeight;

            if (containerWidth === 0 || containerHeight === 0) return;

            // Read the actual rendered gap from the DOM (handles responsive Tailwind classes automatically)
            const styles = getComputedStyle(el);
            const gapPx = parseFloat(styles.rowGap) || parseFloat(styles.gap) || 0;

            // Always desktop: 3 columns, 2 rows
            const cellWidth = (containerWidth - 2 * gapPx) / 3;
            const cellHeight = (containerHeight - gapPx) / 2;
            const height2Unit = cellHeight * 2 + gapPx;

            const last = lastMeasuredSizeRef.current;

            if (
                last &&
                Math.abs(last.width - cellWidth) < 0.5 &&
                Math.abs(last.height - cellHeight) < 0.5
            ) {
                return;
            }

            lastMeasuredSizeRef.current = {
                width: cellWidth,
                height: cellHeight,
            };

            onCellSizeChange({
                width: cellWidth,
                height: cellHeight,
                height2Unit,
            });
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(el);

        return () => observer.disconnect();
    }, [onCellSizeChange]);

    const getWidgetAt = (col: number, row: number) =>
        pagePositions.find(
            p => p.column === col && p.row === row
        );

    const canDrop = (col: number, row: number) => {
        if (!activeWidgetId) return false;

        if (activeWidgetFromPage === null) {
            return activeWidgetSize === 2
                ? canAddOrSwap(activeWidgetId, currentPage, col, 0)
                : canAddOrSwap(activeWidgetId, currentPage, col, row);
        }

        return activeWidgetSize === 2
            ? canMoveOrSwap(
                activeWidgetId,
                activeWidgetFromPage,
                currentPage,
                col,
                0
            )
            : canMoveOrSwap(
                activeWidgetId,
                activeWidgetFromPage,
                currentPage,
                col,
                row
            );
    };

    const isOver = (col: number, row: number) =>
        overDropZoneId === `grid-${currentPage}-${col}-${row}`;

    const isOverColumn = (col: number) =>
        isOver(col, 0) || isOver(col, 1);

    const isOriginCell = (col: number, row: number) =>
        activeWidgetFromPage === currentPage &&
        activeWidgetFromColumn === col &&
        activeWidgetFromRow === row;

    // Build all 6 desktop slots
    const slots = [];
    for (let dCol = 0; dCol < GRID_DIMENSIONS.columns; dCol++) {
        for (let dRow = 0; dRow < GRID_DIMENSIONS.rows; dRow++) {
            const widget = getWidgetAt(dCol, dRow);
            const widgetSize = (widget?.size ?? 1) as 1 | 2;
            slots.push({ dCol, dRow, widget, widgetSize });
        }
    }

    return (
        <div className="flex flex-col flex-1 min-h-0 w-full gap-y-4">
            <div className="flex-center-between w-full shrink-0">
                <BetterTypography variant="base" weight="semibold">
                    Page {currentPage}
                </BetterTypography>
            </div>

            <div
                ref={gridRef}
                className="grid w-full h-full gap-1 md:gap-2 lg:gap-3"
                style={{
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridTemplateRows: 'repeat(2, 1fr)',
                }}
            >
                {slots.map(({ dCol, dRow, widget, widgetSize }) => {
                    const colWidget0 = getWidgetAt(dCol, 0);
                    const colHas2UnitWidget = colWidget0?.size === 2;

                    // Skip phantom second-row slot when column has a 2-unit widget
                    if (colHas2UnitWidget && dRow === 1) {
                        return null;
                    }

                    const isThisOver = isOver(dCol, dRow);
                    const isOrigin = isOriginCell(dCol, dRow);
                    const canDropHere = canDrop(dCol, dRow);

                    const isColHoveredFor2Unit = activeWidgetSize === 2 && isOverColumn(dCol);

                    const isOriginColFor2Unit =
                        activeWidgetFromPage === currentPage &&
                        activeWidgetFromColumn === dCol &&
                        activeWidgetSize === 2;

                    const effectiveOver = isThisOver || isColHoveredFor2Unit;

                    const showWidget = !effectiveOver && !!widget && !isOrigin;
                    const showPlaceholder = isOrigin && !effectiveOver && activeWidgetId !== null;

                    // Hide second row when dragging a 2-unit widget over this column
                    const isHiddenDesktop = dRow === 1 && (isColHoveredFor2Unit || isOriginColFor2Unit);

                    const desktopRowSpan: 1 | 2 =
                        (widgetSize === 2 && dRow === 0) ? 2 :
                            (isColHoveredFor2Unit && dRow === 0) ? 2 :
                                (isOrigin && activeWidgetSize === 2 && dRow === 0) ? 2 :
                                    1;

                    return (
                        <DropZone
                            key={`${dCol}-${dRow}`}
                            id={`grid-${currentPage}-${dCol}-${dRow}`}
                            column={dCol}
                            row={dRow}
                            rowSpan={desktopRowSpan}
                            isOver={effectiveOver}
                            canDrop={canDropHere}
                            hasWidget={showWidget}
                            isHidden={isHiddenDesktop}
                        >
                            {showWidget ? (
                                <DraggablePlacedWidget
                                    position={widget!}
                                    page={currentPage}
                                    onRemove={() =>
                                        onRemoveWidget(
                                            widget!.widgetId,
                                            currentPage
                                        )
                                    }
                                />
                            ) : showPlaceholder ? (
                                <div className="w-full h-full rounded-3xl border-2 border-dashed border-border/50 bg-background/5 flex items-center justify-center">
                                    <BetterTypography
                                        variant="xs"
                                        className="text-muted-foreground/60"
                                    >
                                        Moving...
                                    </BetterTypography>
                                </div>
                            ) : !effectiveOver ? (
                                <BetterTypography
                                    variant="xs"
                                    className="text-muted-foreground"
                                >
                                    Empty
                                </BetterTypography>
                            ) : null}
                        </DropZone>
                    );
                })}
            </div>
        </div>
    );
}