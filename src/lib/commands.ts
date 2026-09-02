import { useCalendarNotesStore } from '@/components/widgets/calendar/store';
import { useMoodTrackerStore } from '@/components/widgets/mood-tracker/store';
import { moodMessages, type MoodType } from '@/components/widgets/mood-tracker/types';
import { useNotesAndChecklistsStore } from '@/components/widgets/notes-and-checklists/store';
import { usePomodoroStore } from '@/components/widgets/pomodoro/store';
import { useSettingsStore } from '@/stores';
import { toast } from 'sonner';

export interface Command {
    id: string;
    label: string;
    description: string;
    keywords: string[]; // For fuzzy matching in suggestions
    handler: (args: string) => void | Promise<void>;
}

export const commands: Command[] = [
    {
        id: 'note',
        label: '/note',
        description: 'Create a new note',
        keywords: ['n', 'note'],
        handler: (args) => {
            if (!args.trim()) {
                toast.error('Please provide note content');
                return;
            }
            useNotesAndChecklistsStore.getState().addItem(args.trim());
            toast.success('Note created');
        },
    },
    {
        id: 'task',
        label: '/task',
        description: 'Create a task item',
        keywords: ['t', 'task'],
        handler: (args) => {
            if (!args.trim()) {
                toast.error('Please provide task content');
                return;
            }
            useNotesAndChecklistsStore.getState().addItem(`[] ${args.trim()}`);
            toast.success('Task added');
        },
    },
    {
        id: 'mood',
        label: '/mood',
        description: 'Insert mood: great, good, okay, meh, bad',
        keywords: ['m', 'mood'],
        handler: async (args) => {
            const action = args.toLowerCase().trim();
            const validMoods = ['great', 'good', 'okay', 'meh', 'bad'];

            // 1. Validate the input
            if (!validMoods.includes(action)) {
                toast.error(`Invalid mood. Please use: ${validMoods.join(', ')}`);
                return;
            }

            // 2. Get store actions (adjust 'addItem' to your actual method name, e.g., addMood)
            const { getItemByDate, addItem, updateItem } = useMoodTrackerStore.getState();

            // 3. Get today's date (local time to prevent UTC shifting)
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth(); // 0-indexed
            const day = now.getDate();
            const dateArg = new Date(year, month, day);

            // 4. Check for existing entry
            const todayMood = await getItemByDate(dateArg);

            if (todayMood) {

                updateItem(todayMood.id, action as MoodType)
                toast.info(`Mood updated: ${moodMessages[action as MoodType]}`);

                // toast.info('Mood Updated for today!');
                return;
            }

            // 6. Save to store
            // ⚠️ Adjust the object shape below to match your exact TypeScript interface for Mood entries
            await addItem(action as MoodType, dateArg);

            // 7. Success feedback
            // const capitalizedMood = action.charAt(0).toUpperCase() + action.slice(1);
            // toast.success(`Mood logged: ${capitalizedMood} ✨`);
            toast.success(moodMessages[action as MoodType]);
        },
    },

    {
        id: 'calendar',
        label: '/cal',
        description: 'Add a note to a specific date (YYYY-MM-DD)',
        keywords: ['c', 'cal'],
        handler: (args) => {
            const parts = args.trim().split(' ');
            const dateStr = parts[0].toLowerCase();
            const content = parts.slice(1).join(' ');

            if (!content) {
                toast.error('Please provide calendar note content');
                return;
            }

            let year: number, month: number, day: number;
            const now = new Date();

            // 1. Parse the date string into components
            if (dateStr === 'today') {
                year = now.getFullYear();
                month = now.getMonth(); // 0-indexed
                day = now.getDate();
                const dateArg = new Date(year, month, day);

                const doesExists = useCalendarNotesStore.getState().getNoteForDay(dateArg);

                if (doesExists) {
                    toast.error('Note exists for today');
                    return;
                }


            } else if (/^\d{2}-\d{2}$/.test(dateStr)) {
                // Shorthand: MM-DD (Assume current year)
                const [m, d] = dateStr.split('-').map(Number);
                year = now.getFullYear();
                month = m - 1; // JS months are 0-indexed
                day = d;
            } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                // Full format: YYYY-MM-DD
                const [y, m, d] = dateStr.split('-').map(Number);
                year = y;
                month = m - 1;
                day = d;
            } else {
                toast.error('Invalid date. Use "today", "MM-DD", or "YYYY-MM-DD".');
                return;
            }

            // 2. Construct Date using LOCAL time (prevents UTC timezone shifting bugs)
            const dateArg = new Date(year, month, day);

            // 3. Sanity check: Ensure JS didn't auto-roll over invalid dates (e.g., Feb 30 -> Mar 2)
            if (
                dateArg.getFullYear() !== year ||
                dateArg.getMonth() !== month ||
                dateArg.getDate() !== day
            ) {
                toast.error('Invalid date (e.g., that day does not exist in that month).');
                return;
            }
            useCalendarNotesStore.getState().addItem(content, dateArg);
            toast.success(`Added to calendar for ${dateArg}`);
        },
    },

    {
        id: 'theme',
        label: '/theme',
        description: 'Change theme: dark, light, or system',
        keywords: ['theme'],
        handler: (args) => {
            const action = args.toLowerCase().trim();
            const validThemes = ['dark', 'light', 'system'];

            // 1. Validate input
            if (!action || !validThemes.includes(action)) {
                toast.error(`Invalid theme. Please use: ${validThemes.join(', ')}`);
                return;
            }

            // 2. Update the settings store
            // TypeScript knows 'action' is one of the validThemes, but we cast it to be perfectly safe
            useSettingsStore.getState().update({
                theme: action as 'dark' | 'light' | 'system'
            });

            // 3. Success feedback (capitalizes first letter: "Dark", "Light", "System")
            const themeName = action.charAt(0).toUpperCase() + action.slice(1);
            toast.success(`Theme changed to ${themeName}`);
        },
    },

    {
        id: 'pomo',
        label: '/pomo',
        description: 'Control Pomodoro: start, pause, resume, reset, break, focus, create',
        keywords: ['p', 'pomo', 'pomodoro', 'timer', 'focus', 'break', 'create', 'task'],
        handler: async (args) => {
            const parts = args.trim().split(' ');
            const action = parts[0]?.toLowerCase();
            const rest = parts.slice(1).join(' ');

            const validActions = ['start', 'pause', 'resume', 'reset', 'break', 'focus', 'reset-cycle', 'create', 'task'];

            if (!action || !validActions.includes(action)) {
                toast.error(`Invalid action. Use: ${validActions.join(', ')}`);
                return;
            }

            const store = usePomodoroStore.getState();
            const {
                status, session, currentTaskId,
                start, pause, resume, reset, resetCycle,
                completeEarly, skipOvertime,
                createTask, setCurrentTask
            } = store;

            switch (action) {
                case 'create':
                case 'task':
                    if (!rest.trim()) {
                        toast.error('Please provide a task name');
                        return;
                    }
                    try {
                        const newTaskId = await createTask(rest.trim());
                        await setCurrentTask(newTaskId);
                        toast.success(`Task "${rest.trim()}" created and selected`);
                    } catch {
                        toast.error('Failed to create task');
                    }
                    break;
                case 'start':
                    if (!currentTaskId) {
                        toast.error('Please select a task first');
                        return;
                    }
                    if (status === 'idle') {
                        start();
                        toast.success('Pomodoro started');
                    } else {
                        toast.error('Timer is already active');
                    }
                    break;
                case 'pause':
                    if (status === 'running') {
                        pause();
                        toast.success('Pomodoro paused');
                    } else {
                        toast.error('Timer is not running');
                    }
                    break;
                case 'resume':
                    if (status === 'paused') {
                        resume();
                        toast.success('Pomodoro resumed');
                    } else {
                        toast.error('Timer is not paused');
                    }
                    break;
                case 'reset':
                    reset();
                    toast.success('Session reset');
                    break;
                case 'reset-cycle':
                    resetCycle();
                    toast.success('Cycle reset');
                    break;
                case 'break':
                    if (session === 'focus') {
                        if (status === 'running' || status === 'paused') {
                            completeEarly();
                            toast.success('Taking an early break!');
                        } else if (status === 'overtime') {
                            skipOvertime();
                            toast.success('Skipping overtime, taking a break!');
                        } else {
                            toast.info('Start a focus session first');
                        }
                    } else {
                        toast.error('You are already on a break!');
                    }
                    break;
                case 'focus':
                    if (session === 'short-break' || session === 'long-break') {
                        if (status === 'running' || status === 'paused') {
                            completeEarly();
                            toast.success('Back to focus!');
                        } else if (status === 'overtime') {
                            skipOvertime();
                            toast.success('Skipping overtime, back to focus!');
                        } else {
                            toast.info('Start a break session first');
                        }
                    } else {
                        toast.error('You are already focusing!');
                    }
                    break;
            }
        },
    },
];