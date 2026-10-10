import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import { useState } from "react";
import UpdateAvailableModal from "./modals/UpdateAvailableModal";
import { RefreshCwIcon } from "lucide-react";
import { toast } from "@/stores/useToastStore";
import { isVersionHigher } from "@/lib/version";

const UPDATE_CHECK_URL = import.meta.env.VITE_UPDATE_CHECK_URL ||
    "https://raw.githubusercontent.com/alizs10/aure-homepage-chrome-extension/main/version.json";

interface VersionInfo {
    latestVersion: string;
    minimumSupportedVersion: string;
    releaseDate: string;
    downloadUrl: string;
    releasePage: string;
    notes: string[];
}

export default function CheckForUpdate() {
    const [open, setOpen] = useState(false);
    const [update, setUpdate] = useState<VersionInfo | null>(null);
    const [loading, setLoading] = useState(false)

    async function checkForUpdate() {
        if (loading) return

        setLoading(true)

        try {
            const res = await fetch(UPDATE_CHECK_URL, {
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch latest version.");
            }

            const latest: VersionInfo = await res.json();
            const currentVersion = import.meta.env.VITE_APP_VERSION;

            // 🌟 Robust semantic version comparison
            if (isVersionHigher(latest.latestVersion, currentVersion)) {
                setUpdate(latest);
                setOpen(true);
            } else {
                toast.info("Already up to date.")
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to check for updates.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button
                onClick={checkForUpdate}
                size="sm"
                variant="primary"
                leftIcon={<RefreshCwIcon className="size-4" />}
                disabled={loading}
            >
                <BetterTypography variant="xs">
                    {loading ? "checking..." : "Check for update"}
                </BetterTypography>
            </Button>

            {(open && update) && (
                <UpdateAvailableModal
                    open={open}
                    onClose={() => setOpen(false)}
                    currentVersion={import.meta.env.VITE_APP_VERSION}
                    latest={update}
                />
            )}
        </>
    );
}