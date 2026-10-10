import { useEffect, useState, useCallback, useRef } from 'react';
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

    // 🌟 Ref to track current page inside event listeners without re-subscribing
    const currentPageRef = useRef(currentPage);
    useEffect(() => {
        currentPageRef.current = currentPage;
    }, [currentPage]);

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

    // 🌟 Single source of truth: persist AND broadcast whenever the page changes
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.selectedPage, effectiveCurrentPage.toString());
        window.dispatchEvent(
            new CustomEvent('page-change', { detail: effectiveCurrentPage })
        );
    }, [effectiveCurrentPage]);

    // 🌟 Listen for programmatic page changes from other components
    useEffect(() => {
        const handlePageChange = (e: Event) => {
            const customEvent = e as CustomEvent<number>;
            const newPage = customEvent.detail;
            const maxPage = totalPages > 0 ? totalPages : 1;

            // Guard: only apply if valid AND different from current (prevents feedback loops)
            if (
                newPage >= 1 &&
                newPage <= maxPage &&
                newPage !== currentPageRef.current
            ) {
                setCurrentPageState(newPage);
            }
        };

        window.addEventListener('page-change', handlePageChange);
        return () => window.removeEventListener('page-change', handlePageChange);
    }, [totalPages]);

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