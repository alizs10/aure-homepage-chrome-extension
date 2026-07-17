import { BetterTypography } from '@/components/common/BetterTypography';
import { addMonths, format, subMonths } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import Button from '../../../ui/Button';
import DayButton from '../DayButton';
import { useCalendar } from '../hooks/useCalendar';
import AttachedNote from './AttachedNote';
import NewCalendarNote from './NewCalendarNote';

export default function CalendarContent() {

    const { today, isTodaySelected, selectedDay, selectSelectedDay, month, selectMonth, getNoteForDay } = useCalendar()

    const hasAttachedNote = useMemo(() => {
        if (!selectedDay) return false;
        return getNoteForDay(selectedDay);
    }, [selectedDay, getNoteForDay]);

    return (
        <div className="w-full sm:col-span-1 app_container app_gradient app-blur h-full max-h-110 lg:max-h-full flex flex-col gap-y-4 p-5 lg:row-span-2">
            <div className="flex-center-between">
                <BetterTypography className='capitalize text-nowrap' variant='14-16-20' weight='semibold' as="h3">
                    Calendar
                </BetterTypography>

                <div className="flex-row-center gap-x-2 h-full">
                    {(!isTodaySelected && selectedDay) && (
                        <Button
                            size="sm"
                            className="h-full"
                            onClick={() => {
                                selectSelectedDay(today);
                                selectMonth(today);
                            }}
                        >
                            <BetterTypography
                                variant="xs"
                                weight="medium"
                            >
                                Today
                            </BetterTypography>
                        </Button>
                    )}
                    {(selectedDay && !hasAttachedNote) && (
                        <NewCalendarNote />
                    )}
                </div>
            </div>

            <div className="flex-1 min-h-0 w-full">

                <div className="flex items-center justify-between mb-4">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => selectMonth(subMonths(month, 1))}
                    >
                        <ChevronLeftIcon className="size-4" />
                    </Button>

                    <BetterTypography
                        as="span"
                        variant="md"
                        weight='medium'
                    >
                        {format(month, "MMMM yyyy")}
                    </BetterTypography>

                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => selectMonth(addMonths(month, 1))}
                    >
                        <ChevronRightIcon className="size-4" />
                    </Button>
                </div>

                <DayPicker
                    month={month}
                    onMonthChange={selectMonth}
                    hideNavigation
                    mode="single"
                    selected={selectedDay}
                    onSelect={selectSelectedDay}
                    components={{
                        DayButton: DayButton,

                    }}
                    className="text-sm"
                    classNames={{
                        root: "w-full",

                        months: "w-full",
                        month: "w-full space-y-4",

                        month_caption: "hidden",
                        caption_label: "text-lg font-semibold",

                        nav: "flex items-center gap-2",

                        // button_previous: buttonClass("ghost", "icon-sm"),
                        // button_next: buttonClass("ghost", "icon-sm"),

                        weekdays: "grid grid-cols-7",
                        weekday:
                            "flex justify-center text-xs font-medium text-muted-foreground uppercase",

                        month_grid: "w-full border-separate",

                        week: "grid grid-cols-7",

                        day: "flex justify-center",
                    }}
                />
            </div>


            <AttachedNote />

        </div>
    )
}
