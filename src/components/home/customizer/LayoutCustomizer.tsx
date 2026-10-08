// src/components/home/customizer/LayoutCustomizer.tsx

import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import ModalHeader from '@/components/ui/modal/ModalHeader';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
import { type ViewportSize } from '@/constants/widget-weights';
import { useWidgetLayout } from '@/hooks/useWidgetLayout';
import type {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    CollisionDetection,
    Collision,
} from '@dnd-kit/core';
import {
    DndContext,
    DragOverlay,
} from '@dnd-kit/core';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon,
    Trash2Icon,
} from 'lucide-react';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import LayoutGrid, { type CellSize } from './LayoutGrid';
import WidgetPalette from './WidgetPalette';
import type { WidgetId } from '@/types';

const WIDGET_LABELS: Record<WidgetId, string> = {
    'notes-and-checklists': 'Notes & Tasks',
    calendar: 'Calendar',
    pomodoro: 'Pomodoro',
    progresses: 'Progresses',
    'mood-tracker': 'Mood Tracker',
    'pet-house': 'Pet House',
    counters: 'Counters',
};

const customCollisionDetection: CollisionDetection = (args) => {
    const { active, droppableRects, droppableContainers } = args;
    const activeRect = active.rect.current.translated;

    if (!activeRect) return [];

    const collisions: Collision[] = [];

    for (const droppable of droppableContainers) {
        const droppableRect = droppableRects.get(droppable.id);
        if (!droppableRect) continue;

        const left = Math.max(activeRect.left, droppableRect.left);
        const right = Math.min(activeRect.right, droppableRect.right);
        const top = Math.max(activeRect.top, droppableRect.top);
        const bottom = Math.min(activeRect.bottom, droppableRect.bottom);

        if (right < left || bottom < top) continue;

        const intersectionWidth = right - left;
        const intersectionHeight = bottom - top;
        const intersectionArea = intersectionWidth * intersectionHeight;

        const activeArea = activeRect.width * activeRect.height;
        const overlapPercentage = (intersectionArea / activeArea) * 100;

        if (overlapPercentage >= 30) {
            collisions.push({
                id: droppable.id,
                data: {
                    droppableContainer: droppable,
                    value: overlapPercentage,
                },
            });
        }
    }

    return collisions.sort((a, b) =>
        (b.data?.value ?? 0) - (a.data?.value ?? 0)
    );
};

interface LayoutCustomizerProps {
    open: boolean;
    currentPage: number;
    onClose: () => void;
}

export default function LayoutCustomizer({
    open,
    currentPage,
    onClose,
}: LayoutCustomizerProps) {
    const {
        positions,
        totalPages,
        editingPage,
        setEditingPage,
        addPage,
        deletePage,
        clearPage,
        saveLayout,
        cancelCustomizing,
        addWidget,
        removeWidget,
        moveWidget,
        canPlaceWidget,
        canMoveOrSwap,
        canAddOrSwap,
        getAvailableWidgets,
        hasEmptyPage,
    } = useWidgetLayout();

    const [activeWidget, setActiveWidget] = useState<{
        id: WidgetId;
        size: number;
        fromPage: number | null;
        fromColumn: number | null;
        fromRow: number | null;
    } | null>(null);

    const [overDropZoneId, setOverDropZoneId] = useState<string | null>(null);

    const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');

    useEffect(() => {
        const updateViewport = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setViewportSize('mobile');
            } else if (width < 1024) {
                setViewportSize('tablet');
            } else {
                setViewportSize('desktop');
            }
        };

        updateViewport();
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
    }, []);

    const availableWidgets = getAvailableWidgets();
    const canAddPage = !hasEmptyPage();

    const gridContainerRef = useRef<HTMLDivElement>(null);
    const [gridHeight, setGridHeight] = useState<number | undefined>(undefined);

    useLayoutEffect(() => {
        const el = gridContainerRef.current;
        if (!el) return;

        const measure = () => {
            setGridHeight(el.offsetHeight);
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(el);

        return () => observer.disconnect();
    }, [open, editingPage]);

    const [cellSize, setCellSize] = useState<CellSize | null>(null);

    const handleCellSizeChange = useCallback((size: CellSize) => {
        setCellSize(prev => {
            if (
                prev &&
                prev.width === size.width &&
                prev.height === size.height &&
                prev.height2Unit === size.height2Unit
            ) {
                return prev;
            }

            return size;
        });
    }, []);

    useEffect(() => {
        if (open) {
            setEditingPage(currentPage);
        }
    }, [open, currentPage, setEditingPage]);

    const currentPageHasWidgets = positions.some(
        p => p.page === editingPage
    );

    const handleDragStart = (event: DragStartEvent) => {
        const data = event.active.data.current;

        if (!data) return;

        const widgetId = data.widgetId as WidgetId;
        const size = data.size as number;

        const isGridWidget = data.type === 'grid';

        const fromPage = isGridWidget ? (data.fromPage as number) : null;
        const fromColumn = isGridWidget ? (data.fromColumn as number) : null;
        const fromRow = isGridWidget ? (data.fromRow as number) : null;

        setActiveWidget({
            id: widgetId,
            size,
            fromPage,
            fromColumn,
            fromRow,
        });
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;
        const newId = over?.id as string | null;

        setOverDropZoneId(prev => {
            if (prev === newId) return prev;
            return newId;
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        const draggedWidget = activeWidget;

        setActiveWidget(null);
        setOverDropZoneId(null);

        if (!over || !draggedWidget) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId.startsWith('palette-') && overId.startsWith('grid-')) {
            const parts = overId.split('-');
            const page = Number(parts[1]);
            const column = Number(parts[2]);
            const row = Number(parts[3]);

            if (!Number.isInteger(page) || !Number.isInteger(column) || !Number.isInteger(row)) return;

            addWidget(draggedWidget.id, page, column, row);
            return;
        }

        if (activeId.startsWith('grid-') && overId.startsWith('grid-')) {
            const parts = overId.split('-');
            const toPage = Number(parts[1]);
            const toColumn = Number(parts[2]);
            const toRow = Number(parts[3]);

            if (!Number.isInteger(toPage) || !Number.isInteger(toColumn) || !Number.isInteger(toRow)) return;
            if (draggedWidget.fromPage === null) return;

            moveWidget(
                draggedWidget.id,
                draggedWidget.fromPage,
                toPage,
                toColumn,
                toRow
            );
        }
    };

    const handleSave = async () => {
        await saveLayout();
        onClose();
    };

    const handleCancel = () => {
        cancelCustomizing();
        onClose();
    };

    const handleClose = () => {
        cancelCustomizing();
        onClose();
    };

    const handleClearPage = () => {
        clearPage(editingPage);
    };

    const handleDeletePage = () => {
        deletePage(editingPage);
    };

    return (
        <ModalWrapper
            open={open}
            onClose={handleClose}
            className="max-w-[90vw]! xl:max-w-6xl! w-full max-h-[90dvh]!"
        >
            <DndContext
                collisionDetection={customCollisionDetection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {/* 🌟 Full height on mobile (100dvh), 90vh on desktop. Removed rounded corners on mobile for a cleaner full-screen look. */}
                <div className="rounded-3xl liquid-glass bg-transparent! dark:bg-background/10! p-4 sm:p-5 flex flex-col gap-y-4 sm:gap-y-6 h-[90vh] md:max-h-[90vh] overflow-hidden">
                    <ModalHeader
                        title="Customize Layout"
                        onClose={handleClose}
                    />

                    {/* 🌟 Middle section: scrollable on mobile/tablet if space is tight, fixed on desktop */}
                    <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6 overflow-y-auto lg:overflow-hidden">
                        {/* Palette: max 40vh on small screens so it doesn't hide the grid entirely */}
                        <div
                            className="min-h-[150px] max-h-[40vh] flex flex-col w-full lg:h-full lg:max-h-full lg:min-h-0"
                            style={viewportSize === 'desktop' && gridHeight ? { maxHeight: `${gridHeight}px` } : undefined}
                        >
                            <WidgetPalette
                                availableWidgets={availableWidgets}
                                viewportSize={viewportSize}
                            />
                        </div>

                        {/* Grid: min-h-[300px] ensures it never collapses below a usable size on small screens */}
                        <div
                            ref={gridContainerRef}
                            className="flex-1 min-h-[300px] flex flex-col gap-y-4 min-w-0 h-full lg:col-span-3 lg:min-h-0"
                        >
                            <div className="flex-center-between shrink-0">
                                <div className="flex items-center gap-x-0.5 sm:gap-x-2">
                                    <Button
                                        size="icon-sm"
                                        variant="ghost"
                                        onClick={() => setEditingPage(editingPage - 1)}
                                        disabled={editingPage <= 1}
                                    >
                                        <ChevronLeftIcon className="size-4" />
                                    </Button>

                                    <BetterTypography variant="base" weight="semibold" className='text-nowrap truncate'>
                                        Page {editingPage} of {totalPages}
                                    </BetterTypography>

                                    <Button
                                        size="icon-sm"
                                        variant="ghost"
                                        onClick={() => setEditingPage(editingPage + 1)}
                                        disabled={editingPage >= totalPages}
                                    >
                                        <ChevronRightIcon className="size-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-x-0.5 sm:gap-x-2">
                                    {currentPageHasWidgets && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleClearPage}
                                        >
                                            <Trash2Icon className="size-4" />
                                            <BetterTypography variant="xs" weight="medium" className='text-nowrap truncate'>
                                                Clear Page
                                            </BetterTypography>
                                        </Button>
                                    )}

                                    {!currentPageHasWidgets && editingPage > 1 && (
                                        <Button
                                            size="sm"
                                            variant="ghost-destructive"
                                            onClick={handleDeletePage}
                                        >
                                            <Trash2Icon className="size-4" />
                                            <BetterTypography variant="xs" weight="medium" className='text-nowrap truncate'>
                                                Delete Page
                                            </BetterTypography>
                                        </Button>
                                    )}

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => addPage()}
                                        disabled={!canAddPage}
                                    >
                                        <PlusIcon className="size-4" />
                                        <BetterTypography variant="xs" weight="medium" className='hidden sm:block text-nowrap truncate'>
                                            Add Page
                                        </BetterTypography>
                                    </Button>
                                </div>
                            </div>

                            <LayoutGrid
                                currentPage={editingPage}
                                positions={positions}
                                onRemoveWidget={removeWidget}
                                canPlaceWidget={canPlaceWidget}
                                canMoveOrSwap={canMoveOrSwap}
                                canAddOrSwap={canAddOrSwap}
                                activeWidgetId={activeWidget?.id ?? null}
                                activeWidgetSize={activeWidget?.size ?? null}
                                activeWidgetFromPage={activeWidget?.fromPage ?? null}
                                activeWidgetFromColumn={activeWidget?.fromColumn ?? null}
                                activeWidgetFromRow={activeWidget?.fromRow ?? null}
                                overDropZoneId={overDropZoneId}
                                onCellSizeChange={handleCellSizeChange}
                            />
                        </div>
                    </div>

                    <div className="flex mt-4 ml-auto w-fit gap-x-2 shrink-0">
                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                            <BetterTypography variant="sm">Cancel</BetterTypography>
                        </Button>

                        <Button variant="primary-active" size="sm" onClick={handleSave}>
                            <BetterTypography variant="sm">Save Layout</BetterTypography>
                        </Button>
                    </div>
                </div>

                <DragOverlay dropAnimation={null}>
                    {activeWidget ? (
                        <div
                            className="p-3 rounded-2xl liquid-glass flex flex-col justify-center gap-y-1 cursor-grabbing pointer-events-none"
                            style={{
                                width: cellSize ? `${cellSize.width}px` : '17rem',
                                height: cellSize
                                    ? `${activeWidget.size === 2 ? cellSize.height2Unit : cellSize.height}px`
                                    : '12rem',
                            }}
                        >
                            <BetterTypography variant="sm" weight="medium">
                                {WIDGET_LABELS[activeWidget.id]}
                            </BetterTypography>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </ModalWrapper>
    );
}