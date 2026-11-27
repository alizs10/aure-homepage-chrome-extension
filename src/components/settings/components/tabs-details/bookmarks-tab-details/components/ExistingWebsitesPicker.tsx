import { useEffect, useMemo, useState } from 'react';
import Favicon from '@/components/common/Favicon';
import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import { useFavorites, useFolders, useRoutines } from '@/features/bookmarks';
import { getTopSites, type TopSite } from '@/lib/browser/top-sites';

export interface PickableWebsite {
    id: string;
    title: string;
    url: string;
    source: 'favorite' | 'folder' | 'routine' | 'topSite';
    sourceLabel: string;
}

interface ExistingWebsitesPickerProps {
    onSelect: (site: { title: string; url: string }) => void;
    excludeUrls?: string[];
    includeFavorites?: boolean;
    includeFolders?: boolean;
    includeRoutines?: boolean;
    includeTopSites?: boolean;
    excludeFolderId?: number;
    excludeRoutineId?: number;
}

type SourceFilter = 'all' | 'favorite' | 'folder' | 'routine' | 'topSite';

export default function ExistingWebsitesPicker({
    onSelect,
    excludeUrls = [],
    includeFavorites = true,
    includeFolders = true,
    includeRoutines = true,
    includeTopSites = true,
    excludeFolderId,
    excludeRoutineId,
}: ExistingWebsitesPickerProps) {
    const { data: favorites } = useFavorites();
    const { data: folders } = useFolders();
    const { data: routines } = useRoutines();
    const [topSites, setTopSites] = useState<TopSite[]>([]);
    const [activeFilter, setActiveFilter] = useState<SourceFilter>('all');

    useEffect(() => {
        if (includeTopSites) {
            getTopSites().then(setTopSites);
        }
    }, [includeTopSites]);

    const items = useMemo(() => {
        const excludeSet = new Set(
            excludeUrls.map((u) => u.trim().toLowerCase().replace(/\/+$/, ''))
        );
        const seenUrls = new Set<string>();
        const result: PickableWebsite[] = [];

        const addCandidate = (
            rawUrl: string,
            rawTitle: string,
            source: 'favorite' | 'folder' | 'routine' | 'topSite',
            sourceLabel: string
        ) => {
            if (!rawUrl) return;
            const normalized = rawUrl.trim().toLowerCase().replace(/\/+$/, '');
            if (!normalized || excludeSet.has(normalized) || seenUrls.has(normalized)) {
                return;
            }
            seenUrls.add(normalized);
            result.push({
                id: `${source}-${normalized}`,
                title: rawTitle?.trim() || rawUrl,
                url: rawUrl.trim(),
                source,
                sourceLabel,
            });
        };

        if (includeFavorites) {
            favorites.forEach((fav) => {
                addCandidate(fav.url, fav.title, 'favorite', 'Favorite');
            });
        }

        if (includeFolders) {
            folders.forEach((folder) => {
                if (excludeFolderId && folder.id === excludeFolderId) return;
                folder.websites?.forEach((site) => {
                    addCandidate(site.url, site.title, 'folder', `Folder: ${folder.title}`);
                });
            });
        }

        if (includeRoutines) {
            routines.forEach((routine) => {
                if (excludeRoutineId && routine.id === excludeRoutineId) return;
                routine.websites?.forEach((site) => {
                    addCandidate(site.url, site.title, 'routine', `Routine: ${routine.title}`);
                });
            });
        }

        if (includeTopSites && topSites.length > 0) {
            topSites.forEach((site) => {
                addCandidate(site.url, site.title || site.url, 'topSite', 'Top Site');
            });
        }

        return result;
    }, [
        favorites,
        folders,
        routines,
        topSites,
        excludeUrls,
        includeFavorites,
        includeFolders,
        includeRoutines,
        includeTopSites,
        excludeFolderId,
        excludeRoutineId,
    ]);

    const sourceCounts = useMemo(() => {
        const counts: Record<SourceFilter, number> = {
            all: items.length,
            favorite: 0,
            folder: 0,
            routine: 0,
            topSite: 0,
        };
        items.forEach((item) => {
            counts[item.source]++;
        });
        return counts;
    }, [items]);

    const filteredItems = useMemo(() => {
        if (activeFilter === 'all') return items;
        return items.filter((item) => item.source === activeFilter);
    }, [items, activeFilter]);

    if (items.length === 0) {
        return null;
    }

    const availableFilterTabs: { id: SourceFilter; label: string }[] = [
        { id: 'all', label: `All (${sourceCounts.all})` },
    ];

    if (sourceCounts.favorite > 0) {
        availableFilterTabs.push({ id: 'favorite', label: `Favorites (${sourceCounts.favorite})` });
    }
    if (sourceCounts.folder > 0) {
        availableFilterTabs.push({ id: 'folder', label: `Folders (${sourceCounts.folder})` });
    }
    if (sourceCounts.routine > 0) {
        availableFilterTabs.push({ id: 'routine', label: `Routines (${sourceCounts.routine})` });
    }
    if (sourceCounts.topSite > 0) {
        availableFilterTabs.push({ id: 'topSite', label: `Top Sites (${sourceCounts.topSite})` });
    }

    return (
        <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <BetterTypography variant="xs" className="text-muted-foreground font-medium">
                    Pick from existing websites
                </BetterTypography>

                {availableFilterTabs.length > 2 && (
                    <div className="flex items-center gap-1 flex-wrap">
                        {availableFilterTabs.map((tab) => (
                            <Button
                                key={tab.id}
                                type="button"
                                size="xs"
                                variant={activeFilter === tab.id ? 'primary-active' : 'ghost'}
                                onClick={() => setActiveFilter(tab.id)}
                                className="h-5 px-2 text-[10px] rounded-full font-normal"
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto scrollbar-none p-0.5">
                {filteredItems.map((item) => (
                    <Button
                        key={item.id}
                        type="button"
                        variant="primary"
                        onClick={() => onSelect({ title: item.title, url: item.url })}
                        className="h-auto w-full p-2 rounded-2xl flex items-center justify-start gap-2 group text-left border border-border/30 hover:border-primary/40 shadow-none font-normal"
                        leftIcon={
                            <div className="size-5 shrink-0 flex-center">
                                <Favicon url={item.url} className="size-4 rounded-sm" />
                            </div>
                        }
                    >
                        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                            <span className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                                {item.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">
                                {item.sourceLabel}
                            </span>
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    );
}
