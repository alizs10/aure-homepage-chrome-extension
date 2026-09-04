import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { BetterTypography } from '@/components/common/BetterTypography'
import Button from '@/components/ui/Button'
import ModalHeader from '@/components/ui/modal/ModalHeader'
import ModalWrapper from '@/components/ui/modal/ModalWrapper'
import TextInput from '@/components/ui/TextInput'
import { usePomodoro } from '../hooks/usePomodoro'
import { type PomodoroTask } from '../types'

interface TaskSelectorModalProps {
    open: boolean
    onClose: () => void
}

type FormMode = 'idle' | 'create' | 'edit'

export default function TaskSelectorModal({ open, onClose }: TaskSelectorModalProps) {
    // 🌟 Added updateTask and deleteTask
    const { tasks, currentTaskId, setCurrentTask, createTask, updateTask, deleteTask } = usePomodoro()
    const [formMode, setFormMode] = useState<FormMode>('idle')
    const [formName, setFormName] = useState('')
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null)

    const resetForm = () => {
        setFormMode('idle')
        setFormName('')
        setEditingTaskId(null)
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    const handleSelectTask = async (taskId: number | undefined) => {
        await setCurrentTask(taskId)
        onClose()
    }

    const startCreate = () => {
        setFormMode('create')
        setFormName('')
    }

    const startEdit = (task: PomodoroTask) => {
        setFormMode('edit')
        setEditingTaskId(task.id)
        setFormName(task.name)
    }

    const handleSaveTask = async () => {
        if (!formName.trim()) return

        if (formMode === 'create') {
            const id = await createTask(formName.trim())
            await setCurrentTask(id)
            toast.success(`Task "${formName.trim()}" created!`)
        } else if (formMode === 'edit' && editingTaskId !== null) {
            await updateTask(editingTaskId, { name: formName.trim() })
            toast.success(`Task "${formName.trim()}" updated!`)
        }

        resetForm()

        if (formMode === 'create') {
            onClose()
        }
        if (formMode === 'edit') {
            setFormMode("idle")
        }
    }

    const handleDeleteTask = async (taskId: number) => {
        await deleteTask(taskId)
        toast.success('Task deleted')
        if (editingTaskId === taskId) {
            resetForm()
        }
    }

    return (
        <ModalWrapper open={open} onClose={handleClose}>
            <div className="rounded-3xl liquid-glass p-3 md:p-5 flex flex-col gap-4 w-full max-h-[80vh] overflow-y-scroll scrollbar-none">
                <ModalHeader title="Select Task" onClose={handleClose} />

                {/* Existing Tasks */}
                <div className="flex flex-col gap-2">
                    <BetterTypography variant="xs" weight="medium" className="text-muted-foreground">
                        Your Tasks
                    </BetterTypography>

                    {tasks.length === 0 && (
                        <BetterTypography variant="sm" className="text-muted-foreground text-center py-2">
                            No tasks created yet.
                        </BetterTypography>
                    )}
                    {tasks.map((task) => (
                        <div key={task.id} className="flex-row-center gap-x-1 h-9">
                            <Button
                                onClick={() => handleSelectTask(task.id)}
                                size="sm"
                                variant={currentTaskId === task.id ? "primary-active" : "primary"}
                                className="flex-1 justify-start"
                            >
                                <BetterTypography variant="sm" weight="medium">
                                    {task.name}
                                </BetterTypography>
                            </Button>

                            <Button
                                variant="warning"
                                size="icon-sm"
                                onClick={() => startEdit(task)}
                                title="Edit task"
                                className='h-full'
                            >
                                <PencilIcon className="size-4" />
                            </Button>

                            <Button
                                variant="destructive"
                                size="icon-sm"
                                onClick={() => handleDeleteTask(task.id)}
                                title="Delete task"
                                className='h-full'
                            >
                                <TrashIcon className="size-4" />
                            </Button>
                        </div>
                    ))}

                </div>

                {/* Form Section */}
                <div className="flex flex-col gap-3 pt-2 border-t border-border">
                    {formMode === 'idle' ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={startCreate}
                            leftIcon={<PlusIcon className="size-4" />}
                            className="w-full"
                        >
                            <BetterTypography variant='xs' weight='medium'>
                                Create New Task
                            </BetterTypography>
                        </Button>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {/* 🌟 Form Label */}
                            <BetterTypography variant="xs" weight="semibold" className="text-muted-foreground">
                                {formMode === 'create' ? 'Create New Task' : 'Edit Task'}
                            </BetterTypography>

                            {/* 🌟 Name Input with Label */}
                            <div className="flex flex-col gap-1.5">
                                <BetterTypography variant="xs" weight="medium" className="text-foreground">
                                    Name
                                </BetterTypography>
                                <TextInput
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="Task name..."
                                    autoFocus
                                    className="px-3 py-1.5 text-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && formName.trim()) {
                                            handleSaveTask()
                                        }
                                    }}
                                />
                            </div>



                            <div className="flex gap-2 mt-1">
                                <Button variant="ghost" size="sm" onClick={resetForm} title="Cancel">
                                    <BetterTypography variant='xs' weight='medium'>
                                        Cancel
                                    </BetterTypography>
                                </Button>
                                <Button
                                    variant="primary-active"
                                    size="sm"
                                    className="flex-1"
                                    onClick={handleSaveTask}
                                    disabled={!formName.trim()}
                                >
                                    <BetterTypography variant='xs' weight='medium'>
                                        {formMode === 'create' ? 'Create & Select' : 'Save Changes'}
                                    </BetterTypography>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ModalWrapper>
    )
}