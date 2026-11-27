import Favicon from "@/components/common/Favicon";
import { ItemTooltip } from "@/components/common/ItemTooltip";
import Button from "@/components/ui/Button";
import type { Routine } from "@/features/bookmarks";
import { launchRoutine } from "@/features/bookmarks";
import { toast } from "@/stores/useToastStore";
import { ZapIcon } from "lucide-react";
import { useState } from "react";

interface RoutineItemProps {
  routine: Routine;
}

export default function RoutineItem({ routine }: RoutineItemProps) {
  const [isLaunching, setIsLaunching] = useState(false);

  const websiteCount = routine.websites?.length || 0;
  const subtitle = `Click to open ${websiteCount} site${websiteCount !== 1 ? "s" : ""} at once`;

  const handleLaunch = async () => {
    if (websiteCount === 0) return;
    setIsLaunching(true);
    try {
      await launchRoutine(routine.websites);
      toast.info(
        `Opening ${websiteCount} tab${websiteCount !== 1 ? "s" : ""} for "${routine.title}"`,
      );
    } catch (error) {
      console.error("Failed to launch routine:", error);
    } finally {
      setTimeout(() => setIsLaunching(false), 600);
    }
  };

  return (
    <ItemTooltip title={`${routine.title} Routine`} subtitle={subtitle}>
      <Button
        onClick={handleLaunch}
        size="icon-sm"
        variant="primary"
        className={`relative pointer-events-auto size-10 md:size-14 w-auto min-w-10 min-h-10 max-w-10 max-h-10 md:max-w-14 md:max-h-14 md:min-w-14 md:min-h-14 aspect-square h-auto group z-30 p-2 md:p-2.5 rounded-full transition-all duration-200 hover:ring-2 hover:ring-amber-500/50 ${isLaunching ? "scale-95 opacity-80" : ""}`}
      >
        <div
          className={`w-full grid aspect-square ${websiteCount <= 1 ? "grid-cols-1" : "grid-cols-2"} gap-0.5 p-0.5`}
        >
          {routine.websites.slice(0, 4).map((w) => (
            <Favicon
              key={w.id}
              url={w.url}
              className="aspect-square col-span-1 rounded-sm"
            />
          ))}
        </div>

        {/* ⚡ Distinctive Zap Badge to signal instant multi-tab launch */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 translate-1 size-5 md:size-6 rounded-full flex-center liquid-glass-sm transition-transform"
        >
          <ZapIcon className="size-3.5 md:size-4 text-primary group-hover:fill-primary" />
        </div>
      </Button>
    </ItemTooltip>
  );
}
