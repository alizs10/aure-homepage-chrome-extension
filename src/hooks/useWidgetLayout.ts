import { useState, useCallback } from 'react';
import { useSettingsStore } from '@/stores';
import { WIDGET_WEIGHTS, GRID_DIMENSIONS } from '@/constants/widget-weights';
import type { WidgetId, WidgetPosition, WidgetLayout } from '@/types';

type LayoutState = {
    isCustomizing: boolean;
    positions: WidgetPosition[];
    totalPages: number;
    editingPage: number;
    setEditingPage: (page: number) => void;
    addPage: () => boolean;
    deletePage: (page: number) => void;
    clearPage: (page: number) => void;
    startCustomizing: () => void;
    cancelCustomizing: () => void;
    saveLayout: () => Promise<void>;
    addWidget: (widgetId: WidgetId, page: number, column: number, row: number) => boolean;
    removeWidget: (widgetId: WidgetId, page: number) => void;
    moveWidget: (widgetId: WidgetId, fromPage: number, toPage: number, column: number, row: number) => boolean;
    canPlaceWidget: (widgetId: WidgetId, page: number, column: number, row: number, excludeWidgetId?: WidgetId) => boolean;
    canMoveOrSwap: (widgetId: WidgetId, fromPage: number, toPage: number, column: number, row: number) => boolean;
    canAddOrSwap: (widgetId: WidgetId, page: number, column: number, row: number) => boolean;
    getWidgetAtPosition: (page: number, column: number, row: number) => WidgetId | null;
    getAvailableWidgets: () => WidgetId[];
    hasEmptyPage: () => boolean;
    canAddNewPage: () => boolean;
};

export function useWidgetLayout(): LayoutState {
    const { settings, update } = useSettingsStore();
    const [isCustomizing, setIsCustomizing] = useState(false);

    const savedLayout = settings?.widget_layout;

    const [positions, setPositions] = useState<WidgetPosition[]>(savedLayout?.positions ?? []);
    const [totalPages, setTotalPages] = useState(savedLayout?.totalPages ?? 1);
    const [editingPage, setEditingPage] = useState(1);

    const startCustomizing = useCallback(() => {
        setIsCustomizing(true);
        setPositions(savedLayout?.positions ?? []);
        setTotalPages(savedLayout?.totalPages ?? 1);
        setEditingPage(1);
    }, [savedLayout]);

    const cancelCustomizing = useCallback(() => {
        setIsCustomizing(false);
        setPositions(savedLayout?.positions ?? []);
        setTotalPages(savedLayout?.totalPages ?? 1);
    }, [savedLayout]);

    const saveLayout = useCallback(async () => {
        // Clean up multiple blank pages: keep only the first one
        const pageWidgetCounts = new Map<number, number>();

        // Count widgets per page
        for (const pos of positions) {
            pageWidgetCounts.set(pos.page, (pageWidgetCounts.get(pos.page) ?? 0) + 1);
        }

        // Find empty pages
        const emptyPages: number[] = [];
        for (let page = 1; page <= totalPages; page++) {
            if ((pageWidgetCounts.get(page) ?? 0) === 0) {
                emptyPages.push(page);
            }
        }

        let cleanedPositions = positions;
        let cleanedTotalPages = totalPages;

        // If there are multiple empty pages, remove all but the first
        if (emptyPages.length > 1) {
            const pagesToRemove = emptyPages.slice(1); // Keep first empty page, remove rest

            // Remove widgets from pages to be deleted
            cleanedPositions = positions.filter(p => !pagesToRemove.includes(p.page));

            // Update page numbers for remaining widgets
            cleanedPositions = cleanedPositions.map(p => {
                let newPage = p.page;
                for (const removedPage of pagesToRemove) {
                    if (p.page > removedPage) {
                        newPage--;
                    }
                }
                return { ...p, page: newPage };
            });

            // Update total pages
            cleanedTotalPages = totalPages - pagesToRemove.length;
        }

        // 🌟 Update local state to reflect the cleanup immediately
        setPositions(cleanedPositions);
        setTotalPages(cleanedTotalPages);

        const newLayout: WidgetLayout = {
            positions: cleanedPositions,
            totalPages: cleanedTotalPages,
        };

        await update({
            widget_layout: newLayout,
        });

        setIsCustomizing(false);
    }, [positions, totalPages, update]);

    const hasEmptyPage = useCallback((): boolean => {
        for (let page = 1; page <= totalPages; page++) {
            const widgetsOnPage = positions.filter(p => p.page === page);
            if (widgetsOnPage.length === 0) {
                return true;
            }
        }
        return false;
    }, [positions, totalPages]);

    const canAddNewPage = useCallback((): boolean => {
        // Get total number of available widget types
        const totalWidgetTypes = Object.keys(WIDGET_WEIGHTS).length;

        // Allow up to (total widget types + 1) pages
        // Currently 7 widget types = up to 8 pages
        return totalPages < totalWidgetTypes + 1;
    }, [totalPages]);

    const addPage = useCallback((): boolean => {
        if (!canAddNewPage()) {
            return false;
        }

        const newPageNumber = totalPages + 1;
        setTotalPages(newPageNumber);
        setEditingPage(newPageNumber);
        return true;
    }, [canAddNewPage, totalPages]);

    const clearPage = useCallback((page: number) => {
        setPositions(prev => prev.filter(p => p.page !== page));
    }, []);

    const deletePage = useCallback((page: number) => {
        setPositions(prev => prev.filter(p => p.page !== page));

        setPositions(prev =>
            prev.map(p => ({
                ...p,
                page: p.page > page ? p.page - 1 : p.page,
            }))
        );

        setTotalPages(prev => Math.max(1, prev - 1));

        if (editingPage > page) {
            setEditingPage(prev => prev - 1);
        } else if (editingPage === page && page > 1) {
            setEditingPage(page - 1);
        }
    }, [editingPage]);

    const canPlaceWidget = useCallback((
        widgetId: WidgetId,
        page: number,
        column: number,
        row: number,
        excludeWidgetId?: WidgetId
    ): boolean => {
        const widgetSize = WIDGET_WEIGHTS[widgetId] as 1 | 2;

        if (column < 0 || column >= GRID_DIMENSIONS.columns) return false;
        if (row < 0 || row >= GRID_DIMENSIONS.rows) return false;

        const effectiveRow = widgetSize === 2 ? 0 : row;

        const existingInColumn = positions.filter(
            p => p.page === page && p.column === column && p.widgetId !== excludeWidgetId
        );

        for (const existing of existingInColumn) {
            const existingSize = WIDGET_WEIGHTS[existing.widgetId] as 1 | 2;

            if (existingSize !== widgetSize) return false;

            if (widgetSize === 2) {
                return false;
            } else {
                if (existing.row === effectiveRow) return false;
            }
        }

        return true;
    }, [positions]);

    const canPlaceInPositions = useCallback((
        posArray: WidgetPosition[],
        widgetId: WidgetId,
        page: number,
        column: number,
        row: number
    ): boolean => {
        const widgetSize = WIDGET_WEIGHTS[widgetId] as 1 | 2;

        if (column < 0 || column >= GRID_DIMENSIONS.columns) return false;
        if (row < 0 || row >= GRID_DIMENSIONS.rows) return false;

        const effectiveRow = widgetSize === 2 ? 0 : row;

        const existingInColumn = posArray.filter(
            p => p.page === page && p.column === column
        );

        for (const existing of existingInColumn) {
            const existingSize = WIDGET_WEIGHTS[existing.widgetId] as 1 | 2;

            if (existingSize !== widgetSize) return false;

            if (widgetSize === 2) return false;

            if (existing.row === effectiveRow) return false;
        }

        return true;
    }, []);

    const findRelocationSpotsOnPage = useCallback((
        simulatedPositions: WidgetPosition[],
        displacedWidgets: WidgetPosition[],
        targetPage: number
    ): WidgetPosition[] | null => {
        const relocatedWidgets: WidgetPosition[] = [];

        for (const displacedWidget of displacedWidgets) {
            const displacedSize = WIDGET_WEIGHTS[displacedWidget.widgetId] as 1 | 2;
            let foundSpace = false;
            let newPos: WidgetPosition | null = null;

            for (let c = 0; c < GRID_DIMENSIONS.columns && !foundSpace; c++) {
                for (let r = 0; r < GRID_DIMENSIONS.rows && !foundSpace; r++) {
                    const canPlace = canPlaceInPositions(
                        [...simulatedPositions, ...relocatedWidgets],
                        displacedWidget.widgetId,
                        targetPage, c, r
                    );

                    if (canPlace) {
                        newPos = {
                            widgetId: displacedWidget.widgetId,
                            page: targetPage,
                            column: c,
                            row: displacedSize === 2 ? 0 : r,
                            size: displacedSize,
                        };
                        foundSpace = true;
                    }
                }
            }

            if (!foundSpace || !newPos) {
                return null;
            }

            relocatedWidgets.push(newPos);
        }

        return relocatedWidgets;
    }, [canPlaceInPositions]);

    const computeMaxPage = useCallback((posArray: WidgetPosition[]): number => {
        if (posArray.length === 0) return 1;
        return Math.max(...posArray.map(p => p.page));
    }, []);

    const addWidget = useCallback((
        widgetId: WidgetId,
        page: number,
        column: number,
        row: number
    ): boolean => {
        const widgetSize = WIDGET_WEIGHTS[widgetId] as 1 | 2;
        const effectiveRow = widgetSize === 2 ? 0 : row;

        const widgetsInTargetColumn = positions.filter(
            p => p.page === page && p.column === column
        );

        if (widgetsInTargetColumn.length === 0) {
            if (!canPlaceWidget(widgetId, page, column, effectiveRow)) {
                return false;
            }

            const newPositions = [...positions, {
                widgetId,
                page,
                column,
                row: effectiveRow,
                size: widgetSize,
            }];

            setPositions(newPositions);
            setTotalPages(computeMaxPage(newPositions));

            return true;
        }

        let widgetsToRemove: WidgetPosition[];

        if (widgetSize === 2) {
            widgetsToRemove = widgetsInTargetColumn;
        } else {
            widgetsToRemove = widgetsInTargetColumn.filter(p => p.row === effectiveRow);
        }

        const removeIds = new Set(widgetsToRemove.map(w => w.widgetId));

        const newPositions = positions
            .filter(p => !(p.page === page && p.column === column && removeIds.has(p.widgetId)))
            .concat({ widgetId, page, column, row: effectiveRow, size: widgetSize });

        setPositions(newPositions);
        setTotalPages(computeMaxPage(newPositions));

        return true;
    }, [positions, canPlaceWidget, computeMaxPage]);

    const removeWidget = useCallback((widgetId: WidgetId, page: number) => {
        setPositions(prev => prev.filter(
            p => !(p.widgetId === widgetId && p.page === page)
        ));
    }, []);

    const moveWidget = useCallback((
        widgetId: WidgetId,
        fromPage: number,
        toPage: number,
        column: number,
        row: number
    ): boolean => {
        const widgetSize = WIDGET_WEIGHTS[widgetId] as 1 | 2;
        const effectiveRow = widgetSize === 2 ? 0 : row;

        const originalPos = positions.find(
            p => p.widgetId === widgetId && p.page === fromPage
        );

        if (!originalPos) {
            return false;
        }

        const widgetsInTargetColumn = positions.filter(
            p => p.page === toPage && p.column === column && p.widgetId !== widgetId
        );

        if (widgetsInTargetColumn.length === 0) {
            if (!canPlaceWidget(widgetId, toPage, column, effectiveRow, widgetId)) {
                return false;
            }

            const newPositions = [
                ...positions.filter(p => !(p.widgetId === widgetId && p.page === fromPage)),
                { widgetId, page: toPage, column, row: effectiveRow, size: widgetSize }
            ];

            setPositions(newPositions);
            setTotalPages(computeMaxPage(newPositions));

            return true;
        }

        const simulatedPositions = positions
            .filter(p => !(p.widgetId === widgetId && p.page === fromPage))
            .filter(p => !(p.page === toPage && p.column === column && p.widgetId !== widgetId))
            .concat({ widgetId, page: toPage, column, row: effectiveRow, size: widgetSize });

        const relocatedWidgets = findRelocationSpotsOnPage(simulatedPositions, widgetsInTargetColumn, toPage);

        if (!relocatedWidgets) {
            return false;
        }

        const newPositions = positions
            .filter(p => !(p.widgetId === widgetId && p.page === fromPage))
            .filter(p => !(p.page === toPage && p.column === column && p.widgetId !== widgetId))
            .concat({ widgetId, page: toPage, column, row: effectiveRow, size: widgetSize })
            .concat(relocatedWidgets);

        setPositions(newPositions);
        setTotalPages(computeMaxPage(newPositions));

        return true;
    }, [positions, canPlaceWidget, findRelocationSpotsOnPage, computeMaxPage]);

    const canMoveOrSwap = useCallback((
        widgetId: WidgetId,
        fromPage: number,
        toPage: number,
        column: number,
        row: number
    ): boolean => {
        const widgetSize = WIDGET_WEIGHTS[widgetId] as 1 | 2;
        const effectiveRow = widgetSize === 2 ? 0 : row;

        const originalPos = positions.find(
            p => p.widgetId === widgetId && p.page === fromPage
        );
        if (!originalPos) return false;

        const widgetsInTargetColumn = positions.filter(
            p => p.page === toPage && p.column === column && p.widgetId !== widgetId
        );

        if (widgetsInTargetColumn.length === 0) {
            return canPlaceWidget(widgetId, toPage, column, effectiveRow, widgetId);
        }

        const simulatedPositions = positions
            .filter(p => !(p.widgetId === widgetId && p.page === fromPage))
            .filter(p => !(p.page === toPage && p.column === column && p.widgetId !== widgetId))
            .concat({ widgetId, page: toPage, column, row: effectiveRow, size: widgetSize });

        const relocatedWidgets = findRelocationSpotsOnPage(simulatedPositions, widgetsInTargetColumn, toPage);
        return relocatedWidgets !== null;
    }, [positions, canPlaceWidget, findRelocationSpotsOnPage]);

    const canAddOrSwap = useCallback((
        widgetId: WidgetId,
        page: number,
        column: number,
        row: number
    ): boolean => {
        const widgetSize = WIDGET_WEIGHTS[widgetId] as 1 | 2;
        const effectiveRow = widgetSize === 2 ? 0 : row;

        if (column < 0 || column >= GRID_DIMENSIONS.columns) return false;
        if (effectiveRow < 0 || effectiveRow >= GRID_DIMENSIONS.rows) return false;

        return true;
    }, []);

    const getWidgetAtPosition = useCallback((
        page: number,
        column: number,
        row: number
    ): WidgetId | null => {
        const found = positions.find(
            p => p.page === page && p.column === column && p.row === row
        );
        return found?.widgetId ?? null;
    }, [positions]);

    const getAvailableWidgets = useCallback((): WidgetId[] => {
        const allWidgets: WidgetId[] = [
            "notes-and-checklists",
            "calendar",
            "mood-tracker",
            "pet-house",
            "pomodoro",
            "counters",
            "progresses",
        ];

        const placedWidgets = new Set(positions.map(p => p.widgetId));
        return allWidgets.filter(id => !placedWidgets.has(id));
    }, [positions]);

    return {
        isCustomizing,
        positions,
        totalPages,
        editingPage,
        setEditingPage,
        addPage,
        deletePage,
        clearPage,
        startCustomizing,
        cancelCustomizing,
        saveLayout,
        addWidget,
        removeWidget,
        moveWidget,
        canPlaceWidget,
        canMoveOrSwap,
        canAddOrSwap,
        getWidgetAtPosition,
        getAvailableWidgets,
        hasEmptyPage,
        canAddNewPage
    };
}