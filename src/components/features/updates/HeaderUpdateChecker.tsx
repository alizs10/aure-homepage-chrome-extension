import { useState } from "react";
import { RefreshCwIcon } from "lucide-react";
import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import UpdateAvailableModal from "@/components/settings/components/modals/UpdateAvailableModal";
import { useUpdateChecker } from "@/hooks/useUpdateChecker";

export default function HeaderUpdateChecker() {
    const { hasUpdate, updateInfo, currentVersion } = useUpdateChecker(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (hasUpdate && updateInfo) {
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
                    currentVersion={currentVersion}
                    latest={updateInfo}
                />
            </>
        );
    }

    return null;
}