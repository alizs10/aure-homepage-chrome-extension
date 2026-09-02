import { useMemo, useRef, useState, useEffect } from "react";
import { extent } from "d3-array";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath, AreaClosed, Line } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { Group } from "@visx/group";
import { parseISO } from "date-fns";
import { LinearGradient } from "@visx/gradient";

import { PomodoroRepository } from "../../../db/db";
import type { PomodoroHistoryEntry } from "../../../types";
import {
    filterHistoryByDays,
    groupHistoryByDay,
    fillMissingDays,
    type DayBucket
} from "../../../helpers/chart";
import TaskDetailsPanel from "./TaskDetailsPanel";

const margin = { top: 10, right: 10, bottom: 10, left: 10 };

type ChartPoint = {
    date: Date;
    focusTime: number;
    sessions: number;
    label: string;
    bucket: DayBucket;
};

interface PomodoroChartProps {
    days: number;
    formatDuration: (ms: number) => string;
}

export default function PomodoroChart({ days, formatDuration }: PomodoroChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [history, setHistory] = useState<PomodoroHistoryEntry[]>([]);
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            const data = await PomodoroRepository.getHistory();
            setHistory(data);
        };
        fetchHistory();
    }, []);

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

    const chartData = useMemo<ChartPoint[]>(() => {
        const filtered = filterHistoryByDays(history, days);
        const grouped = groupHistoryByDay(filtered);
        const filled = fillMissingDays(grouped, days);

        return filled.map(bucket => ({
            date: parseISO(bucket.date),
            focusTime: bucket.totalFocusTime,
            sessions: bucket.totalSessions,
            label: bucket.label,
            bucket,
        }));
    }, [history, days]);

    // 🌟 React 19 Pattern: Adjust state during render to avoid useEffect cascading renders.
    // If the timeframe changes and the hovered date is no longer in the dataset, clear it.
    const [prevDays, setPrevDays] = useState(days);
    if (prevDays !== days) {
        setPrevDays(days);
        if (hoveredDate && !chartData.some(d => d.bucket.date === hoveredDate)) {
            setHoveredDate(null);
        }
    }

    const activeHoveredIndex = hoveredDate !== null
        ? chartData.findIndex(d => d.bucket.date === hoveredDate)
        : -1;

    const activeBucket = activeHoveredIndex !== -1 ? chartData[activeHoveredIndex].bucket : null;

    const xDomain = useMemo(() => {
        if (chartData.length === 0) return [new Date(), new Date()] as [Date, Date];
        const ext = extent(chartData, (d: ChartPoint) => d.date) as [Date, Date];
        if (ext[0].getTime() === ext[1].getTime()) {
            const d = new Date(ext[0]);
            return [new Date(d.setDate(d.getDate() - 1)), new Date(d.setDate(d.getDate() + 2))];
        }
        return ext;
    }, [chartData]);

    const maxFocusTime = useMemo(() => {
        const max = Math.max(...chartData.map(d => d.focusTime), 0);
        return max > 0 ? max * 1.1 : 3600000;
    }, [chartData]);

    const innerWidth = dimensions.width - margin.left - margin.right;
    const innerHeight = dimensions.height - margin.top - margin.bottom;

    const getX = (d: ChartPoint) => d.date;
    const getY = (d: ChartPoint) => d.focusTime;

    const xScale = scaleTime({ domain: xDomain, range: [0, innerWidth] });
    const yScale = scaleLinear({ domain: [0, maxFocusTime], range: [innerHeight, 0], nice: true });

    const handleMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - bounds.left;

        let closestIndex = 0;
        let minDist = Infinity;

        chartData.forEach((d, i) => {
            const dist = Math.abs(xScale(d.date) - x);
            if (dist < minDist) {
                minDist = dist;
                closestIndex = i;
            }
        });

        const newDate = chartData[closestIndex].bucket.date;
        if (hoveredDate !== newDate) {
            setHoveredDate(newDate);
        }
    };

    return (
        <>
            {/* Chart Container */}
            <div ref={containerRef} className="flex-1 min-h-25 h-25 max-h-25 flex flex-col relative">
                {chartData.length > 0 && dimensions.width > 0 && dimensions.height > 0 && (
                    <svg width={dimensions.width} height={dimensions.height} className="absolute inset-0">
                        <LinearGradient
                            id="focus-area-gradient"
                            from="var(--app-primary)"
                            to="var(--background)"
                            fromOpacity={0.4}
                            toOpacity={0}
                        />
                        <Group left={margin.left} top={margin.top}>
                            <AreaClosed
                                data={chartData}
                                x={(d: ChartPoint) => xScale(getX(d))}
                                y={(d: ChartPoint) => yScale(getY(d))}
                                yScale={yScale}
                                curve={curveMonotoneX}
                                fill="url(#focus-area-gradient)"
                                stroke="none"
                            />
                            <LinePath
                                data={chartData}
                                x={(d: ChartPoint) => xScale(getX(d))}
                                y={(d: ChartPoint) => yScale(getY(d))}
                                curve={curveMonotoneX}
                                stroke="var(--app-primary)"
                                strokeWidth={2}
                                fill="none"
                            />

                            {activeHoveredIndex !== -1 && (
                                <>
                                    <Line
                                        from={{ x: xScale(chartData[activeHoveredIndex].date), y: 0 }}
                                        to={{ x: xScale(chartData[activeHoveredIndex].date), y: innerHeight }}
                                        stroke="var(--muted-foreground)"
                                        strokeWidth={1}
                                        strokeDasharray="4,4"
                                        pointerEvents="none"
                                    />
                                    <circle
                                        cx={xScale(chartData[activeHoveredIndex].date)}
                                        cy={yScale(chartData[activeHoveredIndex].focusTime)}
                                        r={5}
                                        fill="var(--app-primary)"
                                        stroke="var(--background)"
                                        strokeWidth={2}
                                        pointerEvents="none"
                                    />
                                </>
                            )}

                            <rect
                                width={innerWidth}
                                height={innerHeight}
                                fill="transparent"
                                onMouseMove={handleMouseMove}
                            />
                        </Group>
                    </svg>
                )}
            </div>

            {/* 🌟 Details Panel rendered internally */}
            <div className="flex-1 min-h-0 flex flex-col">
                <TaskDetailsPanel
                    bucket={activeBucket}
                    formatDuration={formatDuration}
                />
            </div>
        </>
    );
}