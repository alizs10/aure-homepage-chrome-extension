import { useState } from "react";
import { RefreshCwIcon } from "lucide-react";
import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import UpdateAvailableModal from "./modals/UpdateAvailableModal";
import { toast } from "@/stores/useToastStore";
import { useUpdateChecker } from "@/hooks/useUpdateChecker";

export default function CheckForUpdate() {
    const [open, setOpen] = useState(false);
    const { loading, checkForUpdate, updateInfo, currentVersion } = useUpdateChecker(false);

    async function handleCheck() {
        if (loading) return;

        try {
            const result = await checkForUpdate();
            if (result.hasUpdate && result.updateInfo) {
                setOpen(true);
            } else {
                toast.info("Already up to date.");
            }
        } catch (error) {
            console.error("Update check error:", error);
            toast.error("Unable to check for updates.");
        }
    }

    return (
        <>
            <Button
                onClick={handleCheck}
                size="sm"
                variant="primary"
                leftIcon={<RefreshCwIcon className="size-4" />}
                disabled={loading}
            >
                <BetterTypography variant="xs">
                    {loading ? "checking..." : "Check for update"}
                </BetterTypography>
            </Button>

            {open && updateInfo && (
                <UpdateAvailableModal
                    open={open}
                    onClose={() => setOpen(false)}
                    currentVersion={currentVersion}
                    latest={updateInfo}
                />
            )}
        </>
    );
}