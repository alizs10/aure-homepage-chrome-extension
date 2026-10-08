import { useEffect, useState, useCallback } from 'react';
import { useSettingsStore } from '@/stores';
import { type ViewportSize } from '@/constants/widget-weights';
import { LOCAL_STORAGE_KEYS } from '@/constants/storage_keys';

type PaginationResult = {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    goToNextPage: () => void;
    goToPrevPage: () => void;
    viewportSize: ViewportSize;
};

export function useWidgetPagination(totalPagesOverride?: number): PaginationResult {
    const { settings } = useSettingsStore();
    const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');

    const widgetLayout = settings?.widget_layout;
    const totalPages = totalPagesOverride ?? widgetLayout?.totalPages ?? 1;

    const [currentPage, setCurrentPageState] = useState<number>(() => {
        const savedPage = localStorage.getItem(LOCAL_STORAGE_KEYS.selectedPage);
        if (savedPage !== null) {
            const parsed = parseInt(savedPage, 10);
            if (!isNaN(parsed)) {
                return parsed;
            }
        }
        return 1;
    });

    const effectiveCurrentPage = Math.max(
        1,
        Math.min(currentPage, totalPages > 0 ? totalPages : 1)
    );

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

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.selectedPage, effectiveCurrentPage.toString());
    }, [effectiveCurrentPage]);

    const setCurrentPage = useCallback((page: number) => {
        setCurrentPageState(page);
    }, []);

    const goToNextPage = useCallback(() => {
        setCurrentPageState(prev => prev + 1);
    }, []);

    const goToPrevPage = useCallback(() => {
        setCurrentPageState(prev => prev - 1);
    }, []);

    return {
        currentPage: effectiveCurrentPage,
        totalPages,
        setCurrentPage,
        goToNextPage,
        goToPrevPage,
        viewportSize,
    };
}