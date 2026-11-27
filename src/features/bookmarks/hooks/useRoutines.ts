import { useMemo } from 'react';
import { useRoutinesStore } from '../stores/routines.store';

export function useRoutines() {
    const data = useRoutinesStore((state) => state.data);
    const loading = useRoutinesStore((state) => state.loading);

    const addItem = useRoutinesStore((state) => state.addItem);
    const removeItem = useRoutinesStore((state) => state.removeItem);
    const updateItem = useRoutinesStore((state) => state.updateItem);
    const sortUp = useRoutinesStore((state) => state.sortUp);
    const sortDown = useRoutinesStore((state) => state.sortDown);
    const initialize = useRoutinesStore((state) => state.initialize);

    const addWebsiteToRoutine = useRoutinesStore((state) => state.addWebsiteToRoutine);
    const removeWebsiteFromRoutine = useRoutinesStore((state) => state.removeWebsiteFromRoutine);
    const updateWebsiteInRoutine = useRoutinesStore((state) => state.updateWebsiteInRoutine);
    const sortWebsiteUp = useRoutinesStore((state) => state.sortWebsiteUp);
    const sortWebsiteDown = useRoutinesStore((state) => state.sortWebsiteDown);

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
        addWebsiteToRoutine,
        removeWebsiteFromRoutine,
        updateWebsiteInRoutine,
        sortWebsiteUp,
        sortWebsiteDown,
    };
}
