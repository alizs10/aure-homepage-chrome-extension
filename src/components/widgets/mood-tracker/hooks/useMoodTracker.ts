// contexts/useMoodTracker.ts
import { useContext } from 'react';
import MoodTrackerContext from '../contexts/MoodTrackerContext';

export function useMoodTracker() {
    const context = useContext(MoodTrackerContext);
    if (context === undefined) {
        throw new Error('useMoodTracker must be used within a MoodTrackerProvider');
    }
    return context;
}