import Button from '@/components/common/Button'
import Toggle from '@/components/common/Toggle'
import { Typography } from '@/components/common/Typography'
import React from 'react'

function NotesAndChecklistsToggle() {
    return (
        <div className="flex-center-between">
            <label htmlFor="theme">
                <Typography variant="label">
                    Notes and Checklists
                </Typography>
            </label>
            <Toggle defaultChecked />
        </div>
    )
}

function CalendarToggle() {
    return (
        <div className="flex-center-between">
            <label htmlFor="theme">
                <Typography variant="label">
                    Calendar
                </Typography>
            </label>
            <Toggle defaultChecked />
        </div>
    )
}

function MoodTrackerToggle() {
    return (
        <div className="flex-center-between">
            <label htmlFor="theme">
                <Typography variant="label">
                    Mood Tracker
                </Typography>
            </label>
            <Toggle defaultChecked />
        </div>
    )
}

function PetHouseToggle() {
    return (
        <div className="flex-center-between">
            <label htmlFor="theme">
                <Typography variant="label">
                    Pet House
                </Typography>
            </label>
            <Toggle defaultChecked />
        </div>
    )
}

export default function WidgetsCenterTabDetails() {
    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-2">
                <label htmlFor="theme">
                    <Typography variant="h3">
                        Widgets
                    </Typography>
                </label>

                <NotesAndChecklistsToggle />
                <CalendarToggle />
                <MoodTrackerToggle />
                <PetHouseToggle />
            </div>

            <div className="col-span-2 mt-auto flex justify-end">
                <Button
                    type="submit"
                    // disabled={!isDirty || !isValid || isSubmitting}
                    variant="primary-active"
                    size="md"
                >
                    <Typography variant="caption">Save Changes</Typography>
                </Button>
            </div>
        </div>
    )
}
