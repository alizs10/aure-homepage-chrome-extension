import { BetterTypography } from "@/components/common/BetterTypography";
import ModalHeader from "@/components/ui/modal/ModalHeader";
import ModalWrapper from "@/components/ui/modal/ModalWrapper";
import ProgressBar from "@/components/ui/ProgressBar";
import CircularProgressBar, {
  type CircularProgressSegment,
} from "@/components/ui/CircularProgressBar";
import { format } from "date-fns";
import type { DayLog } from "../../../types";
import { useWallpaperBackground } from "@/hooks/useWallpaperBackground";
import { useTheme } from "@/hooks/useTheme";
import { useSettingsStore } from "@/stores";
import { accentOptions } from "@/types";
import { toPng } from "html-to-image";
import { useMemo, useRef, useState } from "react";
import { toast } from "@/stores/useToastStore";
import Button from "@/components/ui/Button";
import { ScanSquareIcon } from "lucide-react";
import { cn } from "@/lib/util";

interface DayDetailModalProps {
  open: boolean;
  onClose: () => void;
  day: DayLog;
  formatDuration: (ms: number) => string;
}

export default function DayDetailModal({
  open,
  onClose,
  day,
  formatDuration,
}: DayDetailModalProps) {
  const { background } = useWallpaperBackground();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { settings } = useSettingsStore();

  const captureRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const [year, month, dayNum] = day.dateKey.split("-").map(Number);
  const dateObj = new Date(year, month - 1, dayNum);
  const fullDate = format(dateObj, "MMM d, yyyy");

  // Accent and Theme Colors (safe for html-to-image without currentColor / CSS variable loss)
  const currentAccent =
    accentOptions.find((opt) => opt.id === settings?.accent) ||
    accentOptions[0];
  const primaryColor = isDark ? currentAccent.dark : currentAccent.light;

  const focusColor = isDark ? "#6366f1" : "#4f46e5"; // indigo-500 : indigo-600
  const shortBreakColor = isDark ? "#84cc16" : "#16a34a"; // lime-500 : green-600
  const longBreakColor = isDark ? "#f59e0b" : "#d97706"; // amber-500 : amber-600

  const { focusTime, shortBreakTime, longBreakTime } = useMemo(() => {
    let focus = 0;
    let shortBreak = 0;
    let longBreak = 0;

    day.entries.forEach((entry) => {
      if (entry.type === "focus") {
        focus += entry.duration;
      } else if (entry.type === "short-break") {
        shortBreak += entry.duration;
      } else if (entry.type === "long-break") {
        longBreak += entry.duration;
      }
    });

    return {
      focusTime: focus,
      shortBreakTime: shortBreak,
      longBreakTime: longBreak,
    };
  }, [day.entries]);

  const segments: CircularProgressSegment[] = useMemo(
    () => [
      {
        value: focusTime,
        color: focusColor,
        className: "text-indigo-600 dark:text-indigo-500",
        label: `Focus: ${formatDuration(focusTime)}`,
        key: "focus",
      },
      {
        value: shortBreakTime,
        color: shortBreakColor,
        className: "text-success",
        label: `Short Break: ${formatDuration(shortBreakTime)}`,
        key: "short-break",
      },
      {
        value: longBreakTime,
        color: longBreakColor,
        className: "text-warning",
        label: `Long Break: ${formatDuration(longBreakTime)}`,
        key: "long-break",
      },
    ],
    [
      focusTime,
      shortBreakTime,
      longBreakTime,
      formatDuration,
      focusColor,
      shortBreakColor,
      longBreakColor,
    ],
  );

  const taskBreakdown = (() => {
    const map = new Map<string, { name: string; duration: number }>();
    day.entries.forEach((entry) => {
      if (entry.type === "focus") {
        const name = entry.taskName || "Unknown Task";
        const existing = map.get(name) || { name, duration: 0 };
        existing.duration += entry.duration;
        map.set(name, existing);
      }
    });
    return Array.from(map.values()).sort((a, b) => b.duration - a.duration);
  })();

  const totalFocusTime = focusTime;

  const handleCapture = async () => {
    if (!captureRef.current) return;

    setIsCapturing(true);

    // Wait for React to render the capture state (hiding buttons, showing watermark)
    await new Promise((resolve) => setTimeout(resolve, 150));

    // 🌟 Fix for html-to-image: Inline live computed colors for all SVG strokes and fills
    // so that html-to-image never defaults currentColor or CSS variables to black in the SVG foreignObject
    const svgElements =
      captureRef.current.querySelectorAll<SVGElement>("circle, path, rect");
    const originalStyles: Array<{
      el: SVGElement;
      stroke: string | null;
      strokeStyle: string;
      fill: string | null;
      fillStyle: string;
    }> = [];

    svgElements.forEach((el) => {
      const computed = window.getComputedStyle(el);
      originalStyles.push({
        el,
        stroke: el.getAttribute("stroke"),
        strokeStyle: el.style.stroke,
        fill: el.getAttribute("fill"),
        fillStyle: el.style.fill,
      });

      const currentStroke = el.getAttribute("stroke");
      if (currentStroke && currentStroke !== "none") {
        const resolved =
          currentStroke === "currentColor"
            ? computed.color || computed.stroke
            : computed.stroke && computed.stroke !== "none"
              ? computed.stroke
              : currentStroke;
        if (resolved && resolved !== "none" && resolved !== "currentColor") {
          el.setAttribute("stroke", resolved);
          el.style.stroke = resolved;
        }
      }

      const currentFill = el.getAttribute("fill");
      if (
        currentFill &&
        currentFill !== "none" &&
        currentFill !== "transparent"
      ) {
        const resolvedFill =
          currentFill === "currentColor" ? computed.color : computed.fill;
        if (
          resolvedFill &&
          resolvedFill !== "none" &&
          resolvedFill !== "currentColor"
        ) {
          el.setAttribute("fill", resolvedFill);
          el.style.fill = resolvedFill;
        }
      }
    });

    try {
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        pixelRatio: 2, // Crisp retina quality
      });

      // Create a temporary link to download the image
      const link = document.createElement("a");
      // ⬇️ Add current time to the filename (e.g., focus-summary-2026-10-10_14-30-05.png)
      const timeString = format(new Date(), "HH-mm-ss");
      link.download = `focus-summary-${day.dateKey}_${timeString}.png`;

      link.href = dataUrl;
      link.click();

      toast.success("Screenshot saved!");
    } catch (err) {
      console.error("Screenshot failed", err);
      toast.error("Failed to generate screenshot");
    } finally {
      // Restore original SVG attributes and styles
      originalStyles.forEach(({ el, stroke, strokeStyle, fill, fillStyle }) => {
        if (stroke !== null) el.setAttribute("stroke", stroke);
        else el.removeAttribute("stroke");
        el.style.stroke = strokeStyle;

        if (fill !== null) el.setAttribute("fill", fill);
        else el.removeAttribute("fill");
        el.style.fill = fillStyle;
      });
      setIsCapturing(false);
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      {/* 1. Outer Shell: Handles shadows and rounded corners without clipping them */}
      <div
        ref={captureRef}
        data-accent={settings?.accent || "default"}
        className={cn(
          "w-full max-w-4/5 sm:max-w-md max-h-[80vh] flex flex-col relative overflow-y-scroll scrollbar-none",
          isDark ? "dark" : "",
          isCapturing ? "" : "liquid-glass rounded-3xl",
        )}
      >
        <div
          style={{ backgroundImage: `url(${background})` }}
          className={cn("absolute z-0 inset-0 bg-cover bg-center blur-xs")}
        />
        <div className={cn("absolute z-0 inset-0 bg-background/50")} />

        {/* 2. Clipping Layer: Handles overflow and hides the blurred edges */}
        <div
          className={cn(
            "relative flex-1 overflow-hidden flex flex-col",
            // isCapturing ? "" : "rounded-3xl"
          )}
        >
          {/* 3. Scrollable Content Layer */}
          <div className="relative z-10 flex-1 overflow-y-auto scrollbar-none flex flex-col p-5 gap-5">
            <ModalHeader
              title="Daily Summary"
              onClose={onClose}
              hideClose={isCapturing}
            />

            <div className="w-full flex flex-col items-center gap-3 py-1">
              <div className="relative flex flex-col items-center justify-center rounded-full size-56 liquid-glass bg-background/70">
                <CircularProgressBar
                  size={200}
                  strokeWidth={10}
                  gap={4}
                  segments={segments}
                  showTrack={false}
                  className="absolute inset-3"
                />
                <BetterTypography
                  variant="2xl"
                  weight="bold"
                  className="text-primary tabular-nums leading-tight"
                >
                  {formatDuration(totalFocusTime)}
                </BetterTypography>

                <BetterTypography
                  variant="xs"
                  className="text-muted-foreground"
                >
                  Total focus time
                </BetterTypography>
              </div>

              {/* Session type breakdown indicators */}
              <div className="flex items-center justify-center flex-wrap gap-x-3.5 gap-y-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: focusColor }}
                  />
                  <BetterTypography
                    variant="xs"
                    className="text-muted-foreground"
                  >
                    Focus:{" "}
                    <span className="font-semibold text-foreground tabular-nums">
                      {formatDuration(focusTime)}
                    </span>
                  </BetterTypography>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: shortBreakColor }}
                  />
                  <BetterTypography
                    variant="xs"
                    className="text-muted-foreground"
                  >
                    Short:{" "}
                    <span className="font-semibold text-foreground tabular-nums">
                      {formatDuration(shortBreakTime)}
                    </span>
                  </BetterTypography>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: longBreakColor }}
                  />
                  <BetterTypography
                    variant="xs"
                    className="text-muted-foreground"
                  >
                    Long:{" "}
                    <span className="font-semibold text-foreground tabular-nums">
                      {formatDuration(longBreakTime)}
                    </span>
                  </BetterTypography>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex-center-between">
                <BetterTypography
                  variant="xs"
                  weight="semibold"
                  className="text-muted-foreground"
                >
                  Tasks
                </BetterTypography>
                <BetterTypography variant="xxs" weight="medium">
                  {fullDate}
                </BetterTypography>
              </div>

              {taskBreakdown.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {taskBreakdown.map((task) => {
                    const percentage =
                      totalFocusTime > 0
                        ? (task.duration / totalFocusTime) * 100
                        : 0;
                    return (
                      <div key={task.name} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <BetterTypography
                            variant="xs"
                            weight="medium"
                            className="truncate pr-2"
                          >
                            {task.name}
                          </BetterTypography>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <BetterTypography
                              variant="sm"
                              weight="semibold"
                              className="text-primary tabular-nums"
                            >
                              {formatDuration(task.duration)}
                            </BetterTypography>
                          </div>
                        </div>
                        <ProgressBar
                          value={percentage}
                          fillStyle={{ backgroundColor: primaryColor }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-center py-6">
                  <BetterTypography
                    variant="sm"
                    className="text-muted-foreground"
                  >
                    No focus sessions recorded.
                  </BetterTypography>
                </div>
              )}
            </div>

            {/* Screenshot Button (Hidden during capture) */}
            {!isCapturing && (
              <Button
                variant="primary-active"
                size="sm"
                className="w-full mt-2"
                onClick={handleCapture}
                leftIcon={<ScanSquareIcon className="size-4" />}
              >
                Take screenshot
              </Button>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
