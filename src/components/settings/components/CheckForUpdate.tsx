import Button from "@/components/common/Button";
import { Typography } from "@/components/common/Typography";
import { useState } from "react";
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

    async function checkForUpdate() {
        try {
            const res = await fetch(
                "https://raw.githubusercontent.com/alizs10/aure-homepage-chrome-extension/main/version.json", // Fixed typo: 'extention' -> 'extension'
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
            }
        } catch (error) {
            console.error(error);

            // TODO: Show a toast:
            // "Unable to check for updates."
        }
    }

    return (
        <>
            <Button
                onClick={checkForUpdate}
                size="sm"
                variant="primary"
            >
                <Typography variant="caption-xs">
                    Check for update
                </Typography>
            </Button>

            {update && (
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