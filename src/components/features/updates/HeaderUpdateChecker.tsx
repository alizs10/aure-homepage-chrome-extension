import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { RefreshCwIcon } from "lucide-react";
import UpdateAvailableModal from "@/components/settings/components/modals/UpdateAvailableModal";
import { isVersionHigher } from "@/lib/version";

interface VersionInfo {
    latestVersion: string;
    minimumSupportedVersion: string;
    releaseDate: string;
    downloadUrl: string;
    releasePage: string;
    notes: string[];
}

interface UpdateCheckState {
    lastCheckTime: number;
    hasUpdate: boolean;
    updateInfo: VersionInfo | null;
}

const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY = 'aure_update_check_state';

const UPDATE_CHECK_URL = import.meta.env.VITE_UPDATE_CHECK_URL ||
    "https://raw.githubusercontent.com/alizs10/aure-homepage-chrome-extension/main/version.json";

export default function HeaderUpdateChecker() {
    const [status, setStatus] = useState<'checking' | 'up-to-date' | 'update-available'>('checking');
    const [updateInfo, setUpdateInfo] = useState<VersionInfo | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function checkUpdate() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                let state: UpdateCheckState | undefined;

                if (stored) {
                    try {
                        state = JSON.parse(stored);
                    } catch {
                        // Ignore invalid JSON
                    }
                }

                const now = Date.now();

                if (state && state.lastCheckTime && (now - state.lastCheckTime < CHECK_INTERVAL_MS)) {
                    if (state.hasUpdate && state.updateInfo) {
                        setUpdateInfo(state.updateInfo);
                        setStatus('update-available');
                    } else {
                        setStatus('up-to-date');
                    }
                    return;
                }

                const res = await fetch(UPDATE_CHECK_URL, { cache: "no-store" });

                if (!res.ok) {
                    throw new Error("Failed to fetch latest version.");
                }

                const latest: VersionInfo = await res.json();
                const currentVersion = import.meta.env.VITE_APP_VERSION;

                // 🌟 Robust semantic version comparison
                const hasUpdate = isVersionHigher(latest.latestVersion, currentVersion);

                const newState: UpdateCheckState = {
                    lastCheckTime: now,
                    hasUpdate,
                    updateInfo: hasUpdate ? latest : null
                };

                localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

                if (hasUpdate) {
                    setUpdateInfo(latest);
                    setStatus('update-available');
                } else {
                    setStatus('up-to-date');
                }
            } catch (error) {
                console.error("Update check failed:", error);
                setStatus('up-to-date');
            }
        }

        checkUpdate();
    }, []);

    if (status === 'update-available' && updateInfo) {
        // if (true) {
        return (
            <>
                <Button
                    variant="ghost"
                    size="xs"
                    className="gap-x-1 hidden sm:flex"
                    onClick={() => setIsModalOpen(true)}
                >
                    <RefreshCwIcon className="size-3.5 text-success" />
                    <BetterTypography variant="12" weight="medium" className="text-success">
                        Update available
                    </BetterTypography>
                </Button>
                <UpdateAvailableModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    currentVersion={import.meta.env.VITE_APP_VERSION}
                    latest={updateInfo}
                />
            </>
        );
    }

    return null;
}