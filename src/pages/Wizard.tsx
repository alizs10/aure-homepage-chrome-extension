import { useMemo, useState, type ChangeEvent, type ChangeEventHandler } from "react";
import Button from "../components/common/Button";
import { Typography } from "../components/common/Typography";
import { CheckCircleIcon, CheckIcon } from "lucide-react";
import TextInput from "../components/Form/TextInput";
import type { Settings, Theme } from "../types/settings";
import { storage } from "../lib/storage";

function EnterName({ onChange, value }: { value: string; onChange: (key: "name" | "theme" | "wallpaper", value: string) => void }) {
    return (
        <TextInput
            placeholder="Your name..."
            className=""
            value={value}
            onChange={e => onChange('name', e.target.value)}
        />
    )
}

function ChooseTheme({ onChange, value }: { value: string; onChange: (key: "name" | "theme" | "wallpaper", value: string) => void }) {
    return (
        <div className="grid grid-cols-2 h-20 gap-x-2">
            <button onClick={() => onChange('theme', 'light')} className="h-full rounded-3xl bg-white relative">

                {value === 'light' && (
                    <div className="absolute right-6 bottom-4">
                        <CheckCircleIcon className="size-6 text-success" />
                    </div>
                )}

            </button>
            <button onClick={() => onChange('theme', 'dark')} className="h-full rounded-3xl bg-black relative">
                {value === 'dark' && (
                    <div className="absolute right-6 bottom-4">
                        <CheckCircleIcon className="size-6 text-success" />
                    </div>
                )}
            </button>
        </div>
    )
}


export default function Wizard() {

    const [currentStep, setCurrentStep] = useState(1)
    const [name, setName] = useState("")
    const [theme, setTheme] = useState<Theme>("light")
    const [wallpaper, setWallpaper] = useState("")

    function onChange(key: "name" | "theme" | "wallpaper", value: string) {

        switch (key) {
            case "name":
                setName(value)
                break;
            case "theme":
                setTheme(value as Theme)
                break;

            case "wallpaper":
                setWallpaper(value)
                break;

            default:
                break;
        }


    }

    const [settings, setSettings] = useState<Settings>({
        name: "",
        theme: "light",
        wallpaper: ""
    })

    const [steps, setSteps] = useState([
        { id: 1, label: 'enter your name', status: false },
        { id: 2, label: 'choose theme', status: false },
        { id: 3, label: 'choose background', status: false },
    ])

    const step = useMemo(() => {

        return steps.find(s => s.id === currentStep)

    }, [currentStep, steps])

    function next() {

        // setSettings(prev => {
        //     let settingsIns = {...prev}

        //     if(currentStep === 1)
        //     settingsIns.name = value

        //     if(currentStep === 2)
        //     settingsIns.theme = value as Theme

        //     if(currentStep === 3)
        //     settingsIns.wallpaper = value

        //     return settingsIns
        // })


        if (currentStep === steps.length) {

            const userSettings: Settings = {
                name,
                theme,
                wallpaper
            }

            storage.set("settings", userSettings)

            return
        };

        setSteps(prev => {
            let stepsIns = [...prev]
            let updatableStepIndex = stepsIns.findIndex(s => s.id === currentStep)
            let updatableStep = stepsIns[updatableStepIndex]
            updatableStep.status = true
            return stepsIns
        })

        setCurrentStep(prev => prev >= steps.length ? prev : prev + 1)
    }

    function prev() {

        if (currentStep === 1) return;

        setSteps(prev => {
            let stepsIns = [...prev]
            let updatableStepIndex = stepsIns.findIndex(s => s.id === currentStep - 1)
            let updatableStep = stepsIns[updatableStepIndex]
            updatableStep.status = false

            // if (currentStep === stepsIns.length) {
            //     let updatableLastStep = stepsIns[updatableStepIndex + 1]
            //     updatableLastStep.status = false

            // }

            return stepsIns
        })

        setCurrentStep(prev => prev <= 1 ? prev : prev - 1)
    }

    return (
        <section className="grid grid-cols-2 rounded-3xl bg-background/30 backdrop-blur-md w-full max-w-6xl mx-auto border-t border-border divide-x divide-border overflow-clip">

            <div className="flex flex-col gap-y-8 bg-background col-span-1 p-10">
                <Typography variant="display">
                    Setup Wizard
                </Typography>
                <Typography variant="h1">
                    Lets quickly set you up!
                </Typography>


                <div className="bg-secondary p-1 rounded-full overflow-clip flex-1 flex flex-nowrap gap-x-1 mt-4">
                    {steps.map((step, i) => (
                        <div className={`${currentStep === step.id ? 'flex-1 text-primary' : 'text-muted-foreground'}
                        ${step.status ? 'bg-primary text-primary-foreground' : ''} px-4 py-2 bg-background rounded-full text-center transition-all duration-200 flex-center`}>
                            {step.status ? (
                                <CheckIcon className="size-5" />
                            ) : (
                                <Typography className={` text-nowrap capitalize`} variant="body" weight="medium">
                                    {currentStep === step.id ? `${step.id}. ${step.label}` : `${i + 1}`}
                                </Typography>
                            )}
                        </div>
                    ))}
                </div>

            </div>


            <div className="col-span-1 p-10 flex flex-col gap-y-8 h-full">

                {step && (
                    <Typography className="capitalize" variant="h2">
                        {`${step.id}. ${step.label}`}
                    </Typography>
                )}

                {currentStep === 1 && (
                    <EnterName value={name} onChange={onChange} />
                )}
                {currentStep === 2 && (
                    <ChooseTheme value={theme} onChange={onChange} />
                )}


                <div className="flex justify-end mt-auto gap-x-1 items-end h-fit">
                    {currentStep !== 1 && (
                        <Button
                            onClick={prev}
                            variant="ghost"
                            size="lg"
                        >
                            <Typography variant="h3">
                                Prev
                            </Typography>
                        </Button>
                    )}
                    <Button
                        onClick={next}
                        variant="primary"
                        size="lg"
                    >
                        <Typography variant="h3">
                            {currentStep === steps.length ? "Finish" : "Next"}
                        </Typography>
                    </Button>
                </div>
            </div>

        </section>
    )
}
