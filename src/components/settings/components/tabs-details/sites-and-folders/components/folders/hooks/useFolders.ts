import { useMemo } from 'react';
import { useFoldersStore } from '../store';

export function useFolders() {
    const data = useFoldersStore((state) => state.data);
    const loading = useFoldersStore((state) => state.loading);

    const addItem = useFoldersStore((state) => state.addItem);
    const removeItem = useFoldersStore((state) => state.removeItem);
    const updateItem = useFoldersStore((state) => state.updateItem);
    const sortUp = useFoldersStore((state) => state.sortUp);
    const sortDown = useFoldersStore((state) => state.sortDown);
    const initialize = useFoldersStore((state) => state.initialize);

    const addWebsiteToFolder = useFoldersStore((state) => state.addWebsiteToFolder);
    const removeWebsiteFromFolder = useFoldersStore((state) => state.removeWebsiteFromFolder);
    const updateWebsiteInFolder = useFoldersStore((state) => state.updateWebsiteInFolder);
    const sortWebsiteUp = useFoldersStore((state) => state.sortWebsiteUp);
    const sortWebsiteDown = useFoldersStore((state) => state.sortWebsiteDown);

    const maxOrder = useMemo(() => {
        return data.reduce((max, f) => Math.max(max, f.order), -1);
    }, [data]);

    return {
        data,
        loading,
        addItem,
        removeItem,
        updateItem,
        sortUp,
        sortDown,
        maxOrder,
        initialize,
        addWebsiteToFolder,
        removeWebsiteFromFolder,
        updateWebsiteInFolder,
        sortWebsiteUp,
        sortWebsiteDown
    };
}