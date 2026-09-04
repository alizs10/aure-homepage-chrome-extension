import { useState } from 'react';
import { BetterTypography } from '@/components/common/BetterTypography';
import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';
import Toggle from '@/components/ui/Toggle';
import Slider from '@/components/ui/Slider';
import ProgressBar from '@/components/ui/ProgressBar';
import Dropdown from '@/components/ui/Dropdown';
import ColorPicker from '@/components/ui/ColorPicker';
import Popup from '@/components/ui/Popup';
import ConfirmDialog from '@/components/ui/Dialog';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge'; // 🌟 Added
import { HomeIcon, SettingsIcon, SearchIcon, TrashIcon } from 'lucide-react';

export default function UiShowcase() {
    // Local states for interactive components
    const [textVal, setTextVal] = useState('');
    const [toggleVal, setToggleVal] = useState(false);
    const [sliderVal, setSliderVal] = useState(50);
    const [dropdownVal, setDropdownVal] = useState('option1');
    const [colorVal, setColorVal] = useState('cherry');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogInput, setDialogInput] = useState('');

    const colorOptions = [
        { id: 'cherry', className: 'bg-red-500', label: 'Cherry' },
        { id: 'ocean', className: 'bg-blue-500', label: 'Ocean' },
        { id: 'lime', className: 'bg-green-500', label: 'Lime' },
        { id: 'tangerine', className: 'bg-orange-500', label: 'Tangerine' },
    ];

    const dropdownOptions = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-10 flex flex-col gap-12">
            <div className="flex flex-col gap-2">
                <BetterTypography variant="48-56-72" weight="bold" className="tracking-tight">
                    UI Components
                </BetterTypography>
                <BetterTypography variant="md" className="text-muted-foreground">
                    A comprehensive showcase of all custom UI components, variants, and interactive states.
                </BetterTypography>
            </div>

            {/* BUTTONS */}
            <ShowcaseSection title="Buttons">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap gap-3 items-center">
                        <Button variant="primary">Primary</Button>
                        <Button variant="primary-active">Primary Active</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="success">Success</Button>
                        <Button variant="success-active">Success Active</Button>
                        <Button variant="warning">Warning</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="ghost-destructive">Ghost Destructive</Button>
                        <Button variant="none" className="border border-border">None</Button>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                        <Button size="xs">Size XS</Button>
                        <Button size="sm">Size SM</Button>
                        <Button size="md">Size MD</Button>
                        <Button size="lg">Size LG</Button>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                        <Button size="icon-xs" variant="ghost"><SearchIcon className="size-3" /></Button>
                        <Button size="icon-sm" variant="ghost"><HomeIcon className="size-4" /></Button>
                        <Button size="icon" variant="ghost"><SettingsIcon className="size-5" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                        <Button leftIcon={<HomeIcon className="size-4" />}>Left Icon</Button>
                        <Button rightIcon={<SettingsIcon className="size-4" />}>Right Icon</Button>
                        <Button loading>Loading</Button>
                        <Button disabled>Disabled</Button>
                    </div>
                </div>
            </ShowcaseSection>

            {/* 🌟 BADGES */}
            <ShowcaseSection title="Badges">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap gap-3 items-center">
                        <Badge variant="default" withDot>Default (Primary)</Badge>
                        <Badge variant="secondary" withDot>Secondary</Badge>
                        <Badge variant="success" withDot>Success</Badge>
                        <Badge variant="warning" withDot>Warning</Badge>
                        <Badge variant="destructive" withDot>Destructive</Badge>
                        <Badge variant="outline" withDot>Outline</Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                        <Badge size="sm" variant="default" withDot>Small</Badge>
                        <Badge size="md" variant="default" withDot>Medium</Badge>
                        <Badge size="lg" variant="default" withDot>Large</Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                        <Badge variant="success">No Dot</Badge>
                        <Badge variant="destructive">Error</Badge>
                        <Badge variant="default">Status: Active</Badge>
                    </div>
                </div>
            </ShowcaseSection>

            {/* 🌟 ACCENT BADGES */}
            <ShowcaseSection title="Accent Badges">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap gap-3 items-center">
                        <Badge variant="cherry" withDot>Cherry</Badge>
                        <Badge variant="tangerine" withDot>Tangerine</Badge>
                        <Badge variant="lime" withDot>Lime</Badge>
                        <Badge variant="ocean" withDot>Ocean</Badge>
                        <Badge variant="orchid" withDot>Orchid</Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                        <Badge variant="cherry">No Dot</Badge>
                        <Badge variant="ocean" size="sm">Small Ocean</Badge>
                        <Badge variant="orchid" size="lg">Large Orchid</Badge>
                    </div>
                </div>
            </ShowcaseSection>

            {/* TEXT INPUT */}
            <ShowcaseSection title="Text Input">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
                    <TextInput placeholder="Normal input" value={textVal} onChange={(e) => setTextVal(e.target.value)} />
                    <TextInput placeholder="With error" error="This field is required" />
                    <TextInput placeholder="Disabled" disabled />
                </div>
            </ShowcaseSection>

            {/* TOGGLES */}
            <ShowcaseSection title="Toggles">
                <div className="flex flex-col gap-6 max-w-sm">
                    <Toggle size="sm" checked={toggleVal} onCheckedChange={setToggleVal} leftLabel={<BetterTypography>Small Toggle</BetterTypography>} />
                    <Toggle size="md" checked={toggleVal} onCheckedChange={setToggleVal} leftLabel={<BetterTypography>Medium Toggle</BetterTypography>} />
                    <Toggle size="lg" checked={toggleVal} onCheckedChange={setToggleVal} leftLabel={<BetterTypography>Large Toggle</BetterTypography>} />
                    <Toggle size="md" disabled leftLabel={<BetterTypography className="text-muted-foreground">Disabled</BetterTypography>} />
                </div>
            </ShowcaseSection>

            {/* SLIDER & PROGRESS */}
            <ShowcaseSection title="Slider & Progress Bar">
                <div className="flex flex-col gap-8 max-w-xl">
                    <div className="flex flex-col gap-2">
                        <BetterTypography variant="sm" weight="medium">Slider: {sliderVal}</BetterTypography>
                        <Slider value={sliderVal} onChange={setSliderVal} min={0} max={100} step={10} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <BetterTypography variant="sm" weight="medium">Progress Bar (75%)</BetterTypography>
                        <ProgressBar value={75} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <BetterTypography variant="sm" weight="medium">Progress Bar No Thumb (40%)</BetterTypography>
                        <ProgressBar value={40} showThumb={false} fillClassName="bg-success/50" />
                    </div>
                </div>
            </ShowcaseSection>

            {/* DROPDOWN & COLOR PICKER */}
            <ShowcaseSection title="Dropdown & Color Picker">
                <div className="flex flex-wrap gap-8 items-start">
                    <div className="flex flex-col gap-2">
                        <BetterTypography variant="sm" weight="medium">Dropdown</BetterTypography>
                        <Dropdown
                            value={dropdownVal}
                            options={dropdownOptions}
                            onValueChange={setDropdownVal}
                            placeholder="Select an option"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <BetterTypography variant="sm" weight="medium">Color Picker</BetterTypography>
                        <ColorPicker
                            options={colorOptions}
                            selectedId={colorVal}
                            onSelect={setColorVal}
                        />
                    </div>
                </div>
            </ShowcaseSection>

            {/* POPUP & DIALOG */}
            <ShowcaseSection title="Popup & Dialog">
                <div className="flex flex-wrap gap-4 items-center">
                    <Popup
                        trigger={(props) => (
                            <Button {...props} variant="primary">
                                Open Popup
                            </Button>
                        )}
                    >
                        <div className="p-4 flex flex-col gap-2 min-w-48">
                            <BetterTypography variant="sm" weight="semibold">Popup Content</BetterTypography>
                            <BetterTypography variant="xs" className="text-muted-foreground">
                                This is a BaseUI popover. Click outside to close.
                            </BetterTypography>
                        </div>
                    </Popup>

                    <Button variant="destructive" onClick={() => setDialogOpen(true)}>
                        Open Confirm Dialog
                    </Button>

                    <ConfirmDialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        title="Delete Item"
                        description="Are you sure you want to delete this item? This action cannot be undone."
                        confirmText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => { setDialogOpen(false); setDialogInput(''); }}
                        onCancel={() => { setDialogOpen(false); setDialogInput(''); }}
                        confirmVariant="destructive"
                        confirmIcon={<TrashIcon className="size-4" />}
                        confirmInput={{
                            placeholder: 'Type "DELETE" to confirm',
                            value: dialogInput,
                            onChange: (e) => setDialogInput(e.target.value)
                        }}
                    />
                </div>
            </ShowcaseSection>

            {/* SKELETON */}
            <ShowcaseSection title="Skeletons">
                <div className="flex flex-wrap gap-4 items-center">
                    <Skeleton className="w-32 h-8" />
                    <Skeleton className="w-64 h-24" />
                    <Skeleton className="size-16 rounded-full!" />
                </div>
            </ShowcaseSection>

        </div>
    );
}

// Helper component for consistent section layout
function ShowcaseSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-4 p-6 rounded-3xl liquid-glass border border-border/20">
            <BetterTypography variant="lg" weight="semibold">
                {title}
            </BetterTypography>
            {children}
        </section>
    );
}