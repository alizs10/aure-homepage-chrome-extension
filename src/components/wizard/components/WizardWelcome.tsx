import { BetterTypography } from "@/components/common/BetterTypography";
import Button from "@/components/ui/Button";
import DataBackup from "@/components/settings/components/DataBackup";
import {
  ArrowRightIcon,
  UploadIcon,
  UserPlusIcon,
} from "lucide-react";

export interface WizardWelcomeProps {
  onStartNew: () => void;
}

export function WizardWelcome({ onStartNew }: WizardWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8 max-w-3xl mx-auto w-full h-full py-4 my-auto">
      {/* Header intro */}
      <div className="text-center flex flex-col items-center gap-y-2 max-w-lg">
        <img
          src="/favicon.svg"
          alt="Aure Homepage"
          className="size-12 rounded-2xl mb-1 shadow-xs"
        />
        <BetterTypography variant="xl" weight="bold">
          Welcome to Aure Homepage
        </BetterTypography>
        <BetterTypography variant="sm" className="text-muted-foreground">
          Your personal, fast, and completely private new tab dashboard. Choose
          how you'd like to get started.
        </BetterTypography>
      </div>

      {/* Two Identical Choice Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {/* Box 1: Create New Profile */}
        <div className="p-6 rounded-3xl liquid-glass border border-border/40 flex flex-col justify-between gap-y-6 h-full">
          <div className="flex flex-col gap-y-3">
            <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <UserPlusIcon className="size-5" />
            </div>
            <div className="flex flex-col gap-y-1">
              <BetterTypography variant="md" weight="semibold">
                Create New Profile
              </BetterTypography>
              <BetterTypography
                variant="xs"
                className="text-muted-foreground leading-relaxed"
              >
                Set up your workspace step-by-step. Choose your name,
                wallpapers, color accents, search engine, and widgets.
              </BetterTypography>
            </div>
          </div>

          <Button
            variant="primary-active"
            size="md"
            onClick={onStartNew}
            rightIcon={<ArrowRightIcon className="size-4" />}
            className="w-full mt-auto"
          >
            <BetterTypography variant="sm" weight="medium">
              Create New Profile
            </BetterTypography>
          </Button>
        </div>

        {/* Box 2: Restore from Backup (Uses the same DataBackup as UserInfoTabDetails) */}
        <div className="p-6 rounded-3xl liquid-glass border border-border/40 flex flex-col justify-between gap-y-6 h-full">
          <div className="flex flex-col gap-y-3">
            <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <UploadIcon className="size-5" />
            </div>
            <div className="flex flex-col gap-y-1">
              <BetterTypography variant="md" weight="semibold">
                Restore from Backup
              </BetterTypography>
              <BetterTypography
                variant="xs"
                className="text-muted-foreground leading-relaxed"
              >
                Import an existing Aure Homepage backup file (.json) to instantly restore
                all your bookmarks, notes, widgets, and settings.
              </BetterTypography>
            </div>
          </div>

          <DataBackup
            showExport={false}
            triggerOnly
            importLabel="Restore from Backup"
            importButtonVariant="primary"
            importButtonSize="md"
            importButtonClassName="w-full mt-auto"
            importLabelWeight="medium"
          />
        </div>
      </div>
    </div>
  );
}
