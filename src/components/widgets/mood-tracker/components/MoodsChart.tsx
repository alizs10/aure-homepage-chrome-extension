import { useMemo, useRef, useState, useEffect } from "react";
import { extent } from "d3-array";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath, AreaClosed } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { Group } from "@visx/group";
import { parseISO, format } from "date-fns";
import { LinearGradient } from "@visx/gradient";
import { Tooltip } from "@base-ui/react/tooltip";
import { cn } from "@/lib/util";

import { useMoodTracker } from "../hooks/useMoodTracker";
import {
    filterHistoryByRange,
    moodScoreMap,
    calculateMoodScore,
    getMonthWeekBuckets,
    getQuarterBuckets,
    groupHistoryByBuckets
} from "../helpers/history";
import {
    getScoreIcon,
    getWeekColor,
    getMoodIcon,
    getMoodBgColor,
    getMoodTextColor
} from "../constants/moods";
import { BetterTypography } from "@/components/common/BetterTypography";
import { useTheme } from "@/hooks/useTheme";
import type { MoodHistory, MoodType } from "../types";

const margin = {
    top: 5,
    right: 5,
    bottom: 0,
    left: 5,
};

type ChartPoint = {
    date: Date;
    score: number;
    label: string;
    mood?: MoodType; // Present only for daily data points
    items: MoodHistory[];
};

// Helper for daily items: maps exact MoodType to SVG hex (mirrors getMoodBgColor)
const getDailySvgColor = (mood: MoodType, theme: string) => {
    const isDark = theme === "dark";
    switch (mood) {
        case 'great': return isDark ? "#6366f1" : "#818cf8"; // indigo-500 / indigo-400
        case 'good': return isDark ? "#84cc16" : "#a3e635"; // lime-500 / lime-400
        case 'okay': return isDark ? "#9ca3af" : "#d1d5db"; // gray-400 / gray-300
        case 'meh': return isDark ? "#facc15" : "#fde047"; // yellow-400 / yellow-300
        case 'bad': return isDark ? "#ef4444" : "#f87171"; // red-500 / red-400
        default: return isDark ? "#9ca3af" : "#d1d5db";
    }
};

// Helper for aggregated items: maps score to SVG hex (mirrors getWeekColor)
const getSvgColorFromScore = (score: number, theme: string) => {
    const isDark = theme === "dark";
    if (score >= 4) return isDark ? "#6366f1" : "#818cf8"; // indigo
    if (score >= 3) return isDark ? "#84cc16" : "#a3e635"; // lime
    if (score >= 2) return isDark ? "#9ca3af" : "#d1d5db"; // gray
    if (score >= 1) return isDark ? "#facc15" : "#fde047"; // yellow
    return isDark ? "#ef4444" : "#f87171"; // red
};

export default function MoodsChart() {
    const { resolvedTheme: theme } = useTheme();
    const { data, filter, today } = useMoodTracker();
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const filteredData = useMemo(() => {
        return filterHistoryByRange(data, filter);
    }, [data, filter]);

    const chartData = useMemo<ChartPoint[]>(() => {
        if (filter === 'thisMonth') {
            const buckets = getMonthWeekBuckets(today);
            const grouped = groupHistoryByBuckets(filteredData, buckets);

            return grouped
                .filter(bucket => bucket.items.length > 0)
                .map(bucket => ({
                    date: parseISO(bucket.items[0].date),
                    score: calculateMoodScore(bucket.items),
                    label: bucket.label,
                    items: bucket.items
                }))
                .sort((a, b) => a.date.getTime() - b.date.getTime());
        }

        if (filter === 'thisYear') {
            const buckets = getQuarterBuckets(today);
            const grouped = groupHistoryByBuckets(filteredData, buckets);

            return grouped
                .filter(bucket => bucket.items.length > 0)
                .map(bucket => ({
                    date: parseISO(bucket.items[0].date),
                    score: calculateMoodScore(bucket.items),
                    label: bucket.label,
                    items: bucket.items
                }))
                .sort((a, b) => a.date.getTime() - b.date.getTime());
        }

        // Daily data points (thisWeek, last30days)
        return [...filteredData]
            .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
            .map((item) => {
                const date = parseISO(item.date);
                // Match MoodSquare logic: show "Today" if it matches the current day
                const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

                return {
                    date: date,
                    score: moodScoreMap[item.mood],
                    label: isToday ? 'Today' : format(date, 'MMM d, yyyy'),
                    mood: item.mood, // Tag as daily
                    items: [item]
                };
            });
    }, [filteredData, filter, today]);

    const xDomain = useMemo(() => {
        if (chartData.length === 0) return [new Date(), new Date()] as [Date, Date];
        const ext = extent(chartData, (d: ChartPoint) => d.date) as [Date, Date];
        if (ext[0].getTime() === ext[1].getTime()) {
            const d = new Date(ext[0]);
            return [new Date(d.setDate(d.getDate() - 1)), new Date(d.setDate(d.getDate() + 2))];
        }
        return ext;
    }, [chartData]);

    if (chartData.length === 0 || dimensions.width === 0) {
        return <div ref={containerRef} className="flex-1 min-h-0 w-full" />;
    }

    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    const getX = (d: ChartPoint) => d.date;
    const getY = (d: ChartPoint) => d.score;

    const xScale = scaleTime({
        domain: xDomain,
        range: [0, innerWidth],
    });

    const yScale = scaleLinear({
        domain: [1, 5],
        range: [innerHeight, 0],
    });

    return (
        <div ref={containerRef} className="flex-1 min-h-0 w-full relative">
            <svg width={dimensions.width} height={dimensions.height}>
                <LinearGradient
                    id="area-gradient"
                    from="var(--app-primary)"
                    to="var(--background)"
                    fromOpacity={1}
                    toOpacity={0}
                />
                <Group left={margin.left} top={margin.top}>
                    <AreaClosed
                        data={chartData}
                        x={(d) => xScale(getX(d))}
                        y={(d) => yScale(getY(d))}
                        yScale={yScale}
                        curve={curveMonotoneX}
                        fill="url(#area-gradient)"
                        stroke="none"
                    />
                    <LinePath
                        data={chartData}
                        x={(d) => xScale(getX(d))}
                        y={(d) => yScale(getY(d))}
                        curve={curveMonotoneX}
                        stroke="var(--app-primary)"
                        strokeWidth={2}
                        fill="none"
                    />

                    {chartData.map((point, index) => {
                        // Dynamically determine if this is a daily or aggregated point
                        const isDaily = !!point.mood;

                        const scoreIcon = isDaily
                            ? getMoodIcon(point.mood!)
                            : getScoreIcon(point.score);

                        const popupClasses = isDaily
                            ? cn(getMoodBgColor(point.mood!), getMoodTextColor(point.mood!, true))
                            : getWeekColor(point.score);

                        const circleFill = isDaily
                            ? getDailySvgColor(point.mood!, theme)
                            : getSvgColorFromScore(point.score, theme);

                        return (
                            <Tooltip.Root key={`${point.label}-${index}`}>
                                <Tooltip.Trigger
                                    delay={100}
                                    closeDelay={100}
                                    render={(props) => (
                                        <circle
                                            {...props}
                                            cx={xScale(point.date)}
                                            cy={yScale(point.score)}
                                            r={isDaily ? 5 : 6} // Slightly larger for aggregated points
                                            fill={circleFill}
                                            strokeWidth={0}
                                            className="cursor-pointer transition-all hover:opacity-80"
                                        />
                                    )}
                                />
                                <Tooltip.Portal>
                                    <Tooltip.Positioner side="top" sideOffset={8}>
                                        <Tooltip.Popup
                                            className={cn(
                                                "app_container px-2 py-1 flex flex-row-center gap-x-1 z-9999 data-state=closed:opacity-0 data-state=closed:scale-95 data-state=open:opacity-100 data-state=open:scale-100 transition-all duration-200 origin-var(--transform-origin)",
                                                popupClasses
                                            )}
                                        >
                                            {scoreIcon}
                                            <BetterTypography className="text-nowrap" variant="xs">
                                                {point.label}{!isDaily && `, score: ${point.score}/5`}
                                            </BetterTypography>
                                        </Tooltip.Popup>
                                    </Tooltip.Positioner>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        );
                    })}
                </Group>
            </svg>
        </div>
    );
}