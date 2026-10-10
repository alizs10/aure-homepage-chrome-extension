import PaginationDots from "@/components/home/PaginationDots";
import SearchInput from "@/components/home/SearchInput";
import LayoutCustomizer from "@/components/home/customizer/LayoutCustomizer";
import Favorites from "@/components/home/favorites/Favorites";
import Button from "@/components/ui/Button";
import Counters from "@/components/widgets/counters/Counters";
import Pomodoro from "@/components/widgets/pomodoro/Pomodoro";
import { WIDGET_WEIGHTS, GRID_CONFIGS, mapPositionToViewport } from "@/constants/widget-weights";
import { useWidgetPagination } from "@/hooks/useWidgetPagination";
import { useSettingsStore } from "@/stores";
import type { WidgetId, WidgetPosition } from "@/types";
import { Tooltip } from "@base-ui/react/tooltip";
import { Settings2Icon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TopSites from "../components/home/TopSites";
import Folders from "../components/home/folders/Folders";
import Calendar from "../components/widgets/calendar/Calendar";
import MoodTracker from "../components/widgets/mood-tracker/MoodTracker";
import NotesAndChecklists from "../components/widgets/notes-and-checklists/NotesAndChecklists";
import PetHouse from "../components/widgets/pet-house/PetHouse";
import Progresses from "../components/widgets/progresses/Progresses";

const WIDGET_COMPONENTS: Record<WidgetId, React.ComponentType> = {
    "progresses": Progresses,
    "notes-and-checklists": NotesAndChecklists,
    "calendar": Calendar,
    "pomodoro": Pomodoro,
    "mood-tracker": MoodTracker,
    "pet-house": PetHouse,
    "counters": Counters,
};

export default function Home() {
    const { settings } = useSettingsStore();
    const widgetLayout = settings?.widget_layout;

    const showTopSites = settings?.show_top_sites;
    const showFavorites = settings?.show_favorites;
    const showFolders = settings?.show_folders ?? true;
    const showSitesRow = showTopSites || showFavorites || showFolders;

    const { currentPage, totalPages, setCurrentPage, viewportSize } = useWidgetPagination(widgetLayout?.totalPages);
    const [isCustomizing, setIsCustomizing] = useState(false);

    useEffect(() => {
        const isNewTabPage = window.location.href.startsWith('chrome://newtab') ||
            window.location.pathname.endsWith('/newtab.html') ||
            window.location.pathname.endsWith('/index.html');

        if (!isNewTabPage) return;

        const hasHandledFocus = sessionStorage.getItem('aure_focus_bypass');

        if (!hasHandledFocus && window.location.search !== "?focused") {
            sessionStorage.setItem('aure_focus_bypass', 'true');
            window.location.search = "?focused";
        } else if (window.location.search === "?focused") {
            window.history.replaceState(null, "", window.location.pathname + window.location.hash);
        }
    }, []);

    const currentPageHasWidgets = widgetLayout?.positions?.some(p => p.page === currentPage) ?? false;

    const gridConfig = GRID_CONFIGS[viewportSize];

    // Sort widgets by mapped position (top-to-bottom, left-to-right)
    const sortedWidgets = useMemo(() => {
        if (!widgetLayout?.positions) return [];
        const pagePositions = widgetLayout.positions.filter(p => p.page === currentPage);

        if (viewportSize === 'desktop') return pagePositions;

        return [...pagePositions].sort((a, b) => {
            const sizeA = WIDGET_WEIGHTS[a.widgetId] as 1 | 2;
            const sizeB = WIDGET_WEIGHTS[b.widgetId] as 1 | 2;
            const mappedA = mapPositionToViewport(a.column, a.row, sizeA, viewportSize);
            const mappedB = mapPositionToViewport(b.column, b.row, sizeB, viewportSize);
            if (mappedA.row !== mappedB.row) return mappedA.row - mappedB.row;
            return mappedA.column - mappedB.column;
        });
    }, [widgetLayout, currentPage, viewportSize]);

    const renderDesktopWidgets = () => {
        if (!widgetLayout?.positions) return null;
        const pagePositions = widgetLayout.positions.filter(p => p.page === currentPage);

        return pagePositions.map((position: WidgetPosition) => {
            const WidgetComponent = WIDGET_COMPONENTS[position.widgetId];
            if (!WidgetComponent) return null;

            const widgetSize = WIDGET_WEIGHTS[position.widgetId] as 1 | 2;
            const mapped = mapPositionToViewport(position.column, position.row, widgetSize, viewportSize);

            return (
                <div
                    key={`${position.widgetId}-${position.page}`}
                    style={{
                        gridColumn: `${mapped.column + 1} / ${mapped.column + 2}`,
                        gridRow: `${mapped.row + 1} / ${mapped.row + 1 + mapped.size}`,
                    }}
                    className="h-full w-full"
                >
                    <WidgetComponent />
                </div>
            );
        });
    };

    const renderTabletWidgets = () => {
        // Tablet: 2 columns, auto-flow (no explicit row placement to avoid empty gaps)
        return sortedWidgets.map((position: WidgetPosition) => {
            const WidgetComponent = WIDGET_COMPONENTS[position.widgetId];
            if (!WidgetComponent) return null;

            const widgetSize = WIDGET_WEIGHTS[position.widgetId] as 1 | 2;

            return (
                <div
                    key={`${position.widgetId}-${position.page}`}
                    style={{ gridRowEnd: widgetSize === 2 ? 'span 2' : undefined }}
                    className="w-full"
                >
                    <WidgetComponent />
                </div>
            );
        });
    };

    const renderMobileWidgets = () => {
        // Mobile: 1 column, flex stack
        return sortedWidgets.map((position: WidgetPosition) => {
            const WidgetComponent = WIDGET_COMPONENTS[position.widgetId];
            if (!WidgetComponent) return null;

            const widgetSize = WIDGET_WEIGHTS[position.widgetId] as 1 | 2;

            return (
                <div
                    key={`${position.widgetId}-${position.page}`}
                    style={{ height: widgetSize === 2 ? '31rem' : '15rem' }}
                    className="w-full"
                >
                    <WidgetComponent />
                </div>
            );
        });
    };

    return (
        <section className="w-full max-w-6xl m-auto gap-y-4 md:gap-y-8 flex-center flex-col pt-10 pb-20 space-y-6 overflow-x-clip">
            <div className="sticky top-10 z-40 h-fit min-h-fit w-full flex flex-col gap-y-2 md:gap-y-4">
                <SearchInput />

                {showSitesRow && (
                    <Tooltip.Provider>
                        <div className="flex flex-wrap justify-center gap-1 md:gap-2 z-30 w-full px-4 md:px-8 group/sites pointer-events-none">
                            {showTopSites && <TopSites />} {/* no limits*/}
                            {showFavorites && <Favorites />} {/* 15 limits*/}
                            {showFolders && <Folders />} {/* 5 limits*/}
                            <Link className="transition-opacity duration-200 pointer-events-auto" to="/settings?tab=sites-and-folders">
                                <Button
                                    size='icon-sm'
                                    variant='warning'
                                    className="size-10 md:size-14 w-auto min-w-10 min-h-10 max-w-10 max-h-10 md:max-w-14 md:max-h-14 md:min-w-14 md:min-h-14 aspect-square h-auto group z-30 px-0 p-2.5 rounded-full"
                                >
                                    <Settings2Icon className="min-w-4 md:min-w-8 size-4 md:size-8" />
                                </Button>
                            </Link>
                        </div>
                    </Tooltip.Provider>
                )}
            </div>

            <div className="w-full flex flex-col gap-y-4 px-4 md:px-8 lg:px-10">
                <div className="w-full flex flex-col items-center gap-y-4">
                    {currentPageHasWidgets && (
                        viewportSize === 'desktop' ? (
                            // Desktop: grid with 3 cols × 2 rows, explicit placement
                            <div
                                className="w-full grid gap-4"
                                style={{
                                    gridTemplateColumns: `repeat(${gridConfig.columns}, minmax(0, 1fr))`,
                                    gridTemplateRows: `repeat(${gridConfig.rows}, 15rem)`,
                                }}
                            >
                                {renderDesktopWidgets()}
                            </div>
                        ) : viewportSize === 'tablet' ? (
                            // Tablet: grid with 2 cols, auto-flow (no empty spaces)
                            <div
                                className="w-full grid gap-4"
                                style={{
                                    gridTemplateColumns: `repeat(${gridConfig.columns}, minmax(0, 1fr))`,
                                    gridAutoRows: '15rem',
                                }}
                            >
                                {renderTabletWidgets()}
                            </div>
                        ) : (
                            // Mobile: flex column (1 col, stack only)
                            <div className="w-full flex flex-col gap-4">
                                {renderMobileWidgets()}
                            </div>
                        )
                    )}

                    <PaginationDots
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        onCustomize={() => setIsCustomizing(true)}
                    />
                </div>
            </div>

            <LayoutCustomizer
                open={isCustomizing}
                currentPage={currentPage}
                onClose={() => setIsCustomizing(false)}
            />
        </section>
    );
}