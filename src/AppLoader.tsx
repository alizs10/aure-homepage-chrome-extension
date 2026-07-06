import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSettingsStore } from "./stores";

type AppLoaderProps = {
    children: React.ReactNode;
};

export default function AppLoader({ children }: AppLoaderProps) {
    const loading = useSettingsStore((s) => s.loading);
    const settings = useSettingsStore((s) => s.settings);
    const load = useSettingsStore((s) => s.load);
    const location = useLocation();

    useEffect(() => {
        load();
    }, [load]);

    if (loading) {
        return <>Loading...</>;
    }

    if (!settings && location.pathname !== "/wizard") {
        return <Navigate to="/wizard" replace />;
    }

    return <>
        {children}
    </>;
}