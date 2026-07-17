import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { toast } from "sonner";
import UpdateAvailableModal from "./modals/UpdateAvailableModal";

// Updated interface to match the new JSON structure
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
            const res = await fetch(
                "https://raw.githubusercontent.com/alizs10/aure-homepage-chrome-extension/main/version.json",
                {
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch latest version.");
            }

            const latest: VersionInfo = await res.json();
            const currentVersion = import.meta.env.VITE_APP_VERSION;

            // Simple version check. 
            // Note: For a robust check, you might want to compare semantic versions 
            // to avoid prompting users who are already on a newer beta version.
            if (latest.latestVersion !== currentVersion) {
                setUpdate(latest);
                setOpen(true);
            } else {
                // TODO: Show a toast:
                // "You're already using the latest version."
                console.log("Already up to date.");
                toast.info("Already up to date.")
            }
        } catch (error) {
            console.error(error);

            // TODO: Show a toast:
            // "Unable to check for updates."
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
                loading={loading}
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
                    latest={update} // Passing the whole object for easier access to new fields
                />
            )}
        </>
    );
}