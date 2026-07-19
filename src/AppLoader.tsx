import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSettingsStore } from "./stores";
import { useMoodTracker } from "./components/widgets/mood-tracker/hooks/useMoodTracker";
import { useCalendar } from "./components/widgets/calendar/hooks/useCalendar";
import { usePetHouse } from "./components/widgets/pet-house/hooks/usePetHouse";
import { useNotesAndChecklists } from "./components/widgets/notes-and-checklists/hooks/useNotesAndChecklists";
import { useFavorites } from "./components/settings/components/tabs-details/sites-and-shortcuts/hooks/useFavorites";
import { accentOptions, blurOptions } from "@/types"; // 🌟 Import these

type AppLoaderProps = {
    children: React.ReactNode;
};

export default function AppLoader({ children }: AppLoaderProps) {
    const loading = useSettingsStore((s) => s.loading);
    const settings = useSettingsStore((s) => s.settings);
    const load = useSettingsStore((s) => s.load);

    const { initialize: initMoods, loading: isMoodsLoading } = useMoodTracker();
    const { initialize: initCalendar, loading: isCalendarLoading } = useCalendar();
    const { initialize: initPetHouse, loading: isPetHouseLoading } = usePetHouse();
    const { initialize: initNotes, loading: isNotesLoading } = useNotesAndChecklists();
    const { initialize: initFavorites, loading: isFavoritesLoading } = useFavorites();

    const isLoading = loading || isFavoritesLoading || isMoodsLoading || isCalendarLoading || isPetHouseLoading || isNotesLoading;
    const location = useLocation();

    useEffect(() => {
        load();
        initNotes();
        initMoods();
        initCalendar();
        initPetHouse();
        initFavorites();
    }, [load, initNotes, initMoods, initCalendar, initPetHouse, initFavorites]);

    // 🌟 NEW: Apply global CSS variables as soon as settings are loaded
    useEffect(() => {
        if (!settings) return;

        // 1. Apply Accent
        const accent = accentOptions.find(option => option.id === settings.accent);
        if (accent) {
            document.documentElement.style.setProperty("--app-primary", accent.light);
            document.documentElement.style.setProperty("--app-primary-dark", accent.dark);
        }

        // 2. Apply Blur
        const blur = blurOptions.find(option => option.key === settings.blur);
        if (blur) {
            document.documentElement.style.setProperty("--app-blur", blur.value);
        }
    }, [settings]); // Only runs when settings object changes

    if (isLoading) {
        return null;
    }

    if (!settings && location.pathname !== "/wizard") {
        return <Navigate to="/wizard" replace />;
    }

    return <>{children}</>;
}