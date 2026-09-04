import { BetterTypography } from '@/components/common/BetterTypography';
import {
    CalendarIcon,
    CheckSquareIcon,
    FileTextIcon,
    PaletteIcon,
    SmileIcon,
    TimerIcon
} from 'lucide-react';

export default function CommandsTabDetails() {
    return (
        <div className="h-fit flex-1 flex flex-col gap-y-8">
            {/* Header Section */}
            <BetterTypography variant="sm" className="text-muted-foreground">
                Quickly interact with your widgets and settings using simple text commands.
                Type <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-primary">/</span> in the command input to get started.
            </BetterTypography>

            {/* Commands List */}
            <div className="flex flex-col gap-y-4">

                {/* Note Command */}
                <div className="flex flex-col gap-y-2 p-4 rounded-3xl liquid-glass">
                    <div className="flex-row-center gap-x-2">
                        <FileTextIcon className="size-5 text-primary" />
                        <BetterTypography variant="md" weight="semibold">
                            <span className="font-mono text-primary">/note</span> &lt;content&gt;
                        </BetterTypography>
                    </div>
                    <BetterTypography variant="sm" className="text-muted-foreground">
                        Creates a new note in your Notes & Tasks widget.
                    </BetterTypography>
                    <div className="px-5 py-3 bg-secondary/50 rounded-3xl font-mono text-xs text-muted-foreground">
                        Example: <span className="text-foreground">/note Buy groceries for dinner</span>
                    </div>
                    <div className="px-5 py-3 bg-secondary/50 rounded-3xl font-mono text-xs text-muted-foreground">
                        Shorter Example: <span className="text-foreground">/n Buy groceries for dinner</span>
                    </div>
                </div>

                {/* Task Command */}
                <div className="flex flex-col gap-y-2 p-4 rounded-3xl liquid-glass">
                    <div className="flex-row-center gap-x-2">
                        <CheckSquareIcon className="size-5 text-primary" />
                        <BetterTypography variant="md" weight="semibold">
                            <span className="font-mono text-primary">/task</span> &lt;content&gt;
                        </BetterTypography>
                    </div>
                    <BetterTypography variant="sm" className="text-muted-foreground">
                        Adds a new task item (task) to your Notes & Tasks widget.
                    </BetterTypography>
                    <div className="px-5 py-3 bg-secondary/50 rounded-3xl font-mono text-xs text-muted-foreground">
                        Example: <span className="text-foreground">/task Finish the project report</span>
                    </div>
                    <div className="px-5 py-3 bg-secondary/50 rounded-3xl font-mono text-xs text-muted-foreground">
                        Shorter Example: <span className="text-foreground">/t Finish the project report</span>
                    </div>
                </div>

                {/* Mood Command */}
                <div className="flex flex-col gap-y-2 p-4 rounded-3xl liquid-glass">
                    <div className="flex-row-center gap-x-2">
                        <SmileIcon className="size-5 text-primary" />
                        <BetterTypography variant="md" weight="semibold">
                            <span className="font-mono text-primary">/mood</span> &lt;mood&gt;
                        </BetterTypography>
                    </div>
                    <BetterTypography variant="sm" className="text-muted-foreground">
                        Logs your mood for today. Valid moods: <span className="font-semibold text-foreground">great</span>, <span className="font-semibold text-foreground">good</span>, <span className="font-semibold text-foreground">okay</span>, <span className="font-semibold text-foreground">meh</span>, <span className="font-semibold text-foreground">bad</span>. (Automatically updates if a mood is already logged for today).
                    </BetterTypography>
                    <div className="px-5 py-3 bg-secondary/50 rounded-3xl font-mono text-xs text-muted-foreground">
                        Example: <span className="text-foreground">/mood great</span>
                    </div>
                    <div className="px-5 py-3 bg-secondary/50 rounded-3xl font-mono text-xs text-muted-foreground">
                        Shorter Example: <span className="text-foreground">/m great</span>
                    </div>
                </div>

                {/* Calendar Command */}
                <div className="flex flex-col gap-y-2 p-4 rounded-3xl liquid-glass">
                    <div className="flex-row-center gap-x-2">
                        <CalendarIcon className="size-5 text-primary" />
                        <BetterTypography variant="md" weight="semibold">
                            <span className="font-mono text-primary">/cal</span> &lt;date&gt; &lt;content&gt;
                        </BetterTypography>
                    </div>
                    <BetterTypography variant="sm" className="text-muted-foreground">
                        Adds a note to your calendar. The date can be <span className="font-semibold text-foreground">today</span>, <span className="font-semibold text-foreground">MM-DD</span>, or <span className="font-semibold text-foreground">YYYY-MM-DD</span>.
                    </BetterTypography>
                    <div className="px-5 py-3 bg-secondary/50 rounded-3xl font-mono text-xs text-muted-foreground flex flex-col gap-y-1">
                        <span><span className="text-foreground">/cal today</span> Team meeting at 3 PM</span>
                        <span><span className="text-foreground">/cal 12-25</span> Christmas Day!</span>
                        <span><span className="text-foreground">/cal 2024-01-01</span> New Year's Resolution</span>
                    </div>
                    <div className="px-5 py-3 bg-secondary/50 rounded-3xl font-mono text-xs text-muted-foreground flex flex-col gap-y-1">
                        <span className="mb-1">Shorter Examples:</span>
                        <span><span className="text-foreground">/c today</span> Team meeting at 3 PM</span>
                        <span><span className="text-foreground">/c 12-25</span> Christmas Day!</span>
                    </div>
                </div>

                {/* Theme Command */}
                <div className="flex flex-col gap-y-2 p-4 rounded-3xl liquid-glass">
                    <div className="flex-row-center gap-x-2">
                        <PaletteIcon className="size-5 text-primary" />
                        <BetterTypography variant="md" weight="semibold">
                            <span className="font-mono text-primary">/theme</span> &lt;mode&gt;
                        </BetterTypography>
                    </div>
                    <BetterTypography variant="sm" className="text-muted-foreground">
                        Quickly switches the app theme. Valid modes: <span className="font-semibold text-foreground">dark</span>, <span className="font-semibold text-foreground">light</span>, or <span className="font-semibold text-foreground">system</span>.
                    </BetterTypography>
                    <div className="px-5 py-3 bg-secondary/50 rounded-3xl font-mono text-xs text-muted-foreground">
                        Example: <span className="text-foreground">/theme dark</span>
                    </div>
                </div>

                {/* Pomodoro Command */}
                <div className="flex flex-col gap-y-2 p-4 rounded-3xl liquid-glass">
                    <div className="flex-row-center gap-x-2">
                        <TimerIcon className="size-5 text-primary" />
                        <BetterTypography variant="md" weight="semibold">
                            <span className="font-mono text-primary">/pomo</span> &lt;action&gt;
                        </BetterTypography>
                    </div>
                    <BetterTypography variant="sm" className="text-muted-foreground">
                        Controls the Pomodoro timer. Valid actions: <span className="font-semibold text-foreground">start</span>, <span className="font-semibold text-foreground">pause</span>, <span className="font-semibold text-foreground">resume</span>, <span className="font-semibold text-foreground">reset</span>, <span className="font-semibold text-foreground">break</span>, <span className="font-semibold text-foreground">focus</span>, <span className="font-semibold text-foreground">reset-cycle</span>, <span className="font-semibold text-foreground">create</span>.
                    </BetterTypography>
                    <div className="px-5 py-3 bg-secondary/50 rounded-3xl font-mono text-xs text-muted-foreground flex flex-col gap-y-1">
                        <span><span className="text-foreground">/pomo start</span> - Starts the timer (requires selected task)</span>
                        <span><span className="text-foreground">/pomo pause</span> - Pauses the timer</span>
                        <span><span className="text-foreground">/pomo resume</span> - Resumes the timer</span>
                        <span><span className="text-foreground">/pomo reset</span> - Resets current session</span>
                        <span><span className="text-foreground">/pomo break</span> - Skips to break (or completes focus early)</span>
                        <span><span className="text-foreground">/pomo focus</span> - Skips to focus (or completes break early)</span>
                        <span><span className="text-foreground">/pomo create &lt;name&gt;</span> - Creates and selects a new task</span>
                    </div>
                    <div className="px-5 py-3 bg-secondary/50 rounded-3xl font-mono text-xs text-muted-foreground flex flex-col gap-y-1">
                        <span className="mb-1">Shorter Examples:</span>
                        <span><span className="text-foreground">/p start</span></span>
                        <span><span className="text-foreground">/p create Read a book</span></span>
                    </div>
                </div>

            </div>
        </div>
    );
}