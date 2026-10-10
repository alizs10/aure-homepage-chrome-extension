import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Popup from '@/components/ui/Popup';
import { ChevronLeftIcon, ChevronRightIcon, ListChecksIcon } from 'lucide-react';
import type { Progress } from '../types';

interface ProgressActionsProps {
    progress: Progress;
    onAdvance: () => void;
    onRetreat: () => void;
    onToggleComplete: () => void;
    onToggleStep: (stepId: string) => void;
}

export default function ProgressActions({
    progress,
    onAdvance,
    onRetreat,
    onToggleComplete,
    onToggleStep
}: ProgressActionsProps) {
    if (progress.interactionMode === 'linear') {
        return (
            <LinearStepsView
                progress={progress}
                onAdvance={onAdvance}
                onRetreat={onRetreat}
                onToggleComplete={onToggleComplete}
            />
        );
    }

    return <FreeStepsView progress={progress} onToggle={onToggleStep} />;
}

interface LinearStepsViewProps {
    progress: Progress;
    onAdvance: () => void;
    onRetreat: () => void;
    onToggleComplete: () => void;
}

function LinearStepsView({ progress, onAdvance, onRetreat, onToggleComplete }: LinearStepsViewProps) {
    if (progress.steps.length === 0) {
        return (
            <div className="flex justify-between items-center">
                <BetterTypography variant="sm" className="text-muted-foreground italic">
                    No steps added.
                </BetterTypography>
                <Button size="sm" variant={progress.completed ? "ghost" : "success"} onClick={onToggleComplete}>
                    <BetterTypography variant="xs" weight="medium">
                        {progress.completed ? "Completed" : "Mark Complete"}
                    </BetterTypography>
                </Button>
            </div>
        );
    }

    const { steps, activeStepIndex } = progress;
    const isAtEnd = activeStepIndex === steps.length;
    const isAtStart = activeStepIndex === 0;

    const currentContent = steps[activeStepIndex]?.content || "Complete Step";
    const nextButtonLabel = isAtEnd ? "Completed" : currentContent;

    return (
        <div className="flex items-center gap-x-2">
            <Button
                size="sm"
                variant="ghost"
                disabled={isAtStart}
                onClick={onRetreat}
            >
                <ChevronLeftIcon className="size-4" />
                <BetterTypography variant="xs" weight="medium">Prev</BetterTypography>
            </Button>

            <Button
                size="sm"
                variant={isAtEnd ? "success" : "primary"}
                disabled={isAtEnd}
                onClick={onAdvance}
                className="flex-1 justify-center min-w-0"
                title={isAtEnd ? "All steps completed" : (steps[activeStepIndex]?.content || "No description")}
            >
                <BetterTypography variant="xs" weight="medium" className="truncate">
                    {nextButtonLabel}
                </BetterTypography>
                {!isAtEnd && <ChevronRightIcon className="size-4 shrink-0" />}
            </Button>
        </div>
    );
}

interface FreeStepsViewProps {
    progress: Progress;
    onToggle: (stepId: string) => void;
}

function FreeStepsView({ progress, onToggle }: FreeStepsViewProps) {
    const completedCount = progress.steps.filter(s => s.completed).length;
    const totalCount = progress.steps.length;

    if (totalCount === 0) {
        return <BetterTypography variant="sm" className="text-muted-foreground italic">No steps added.</BetterTypography>;
    }

    return (
        <Popup
            side="bottom"
            align="start"
            sideOffset={8}
            // 🌟 FIX: Use --anchor-width to match the trigger button's exact width
            className="w-(--anchor-width) min-w-48 p-1"
            trigger={(triggerProps) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    leftIcon={<ListChecksIcon className="size-4" />}
                    {...triggerProps}
                >
                    <BetterTypography variant="xs" weight="medium">
                        View Steps ({completedCount}/{totalCount})
                    </BetterTypography>
                </Button>
            )}
        >
            <div className="flex flex-col w-full max-h-60 overflow-y-auto scrollbar-hide space-y-1">
                {progress.steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-x-2 p-1.5">
                        <Checkbox
                            size='md'
                            checked={step.completed}
                            onChange={() => onToggle(step.id)}
                        />
                        <BetterTypography variant="xs" className={`flex-1 ${step.completed ? 'text-muted-foreground line-through' : ''}`}>
                            {step.content || <span className="italic text-muted-foreground">No description</span>}
                        </BetterTypography>
                    </div>
                ))}
            </div>
        </Popup>
    );
}