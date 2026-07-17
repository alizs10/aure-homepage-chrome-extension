import Button from '@/components/ui/Button'
import { Typography } from '@/components/common/Typography'
import TextInput from '@/components/ui/TextInput'
import { copyToClipboard } from '@/helpers'
import { AnimatePresence, motion } from 'framer-motion'
import { CopyCheckIcon, CopyIcon, HeartIcon, MailIcon, SendIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AboutTabDetails() {

    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        if (copied) return


        await copyToClipboard(import.meta.env.VITE_WALLET_ADDRESS)
        setCopied(true)
        toast.success("Copied!")

        setTimeout(() => {

            setCopied(false)

        }, 2000)

    }

    return (
        <div className='h-fit flex-1 flex flex-col gap-y-10'>



            <div className="flex flex-col gap-y-2 p-5 bg-background app_container">

                <Typography variant='body'>
                    App Name: <span className='font-semibold'>{`"${import.meta.env.VITE_APP_NAME}"`}</span>
                </Typography>
                <Typography variant='body'>
                    Version: <span className='font-semibold'>{import.meta.env.VITE_APP_VERSION}</span>
                </Typography>
                <Typography variant='body'>
                    Release: <span className='text-primary font-semibold'>"{import.meta.env.VITE_VERSION_NAME}"</span>
                </Typography>
                <Typography variant='body'>
                    Last Updated: <span className='font-semibold'>{import.meta.env.VITE_VERSION_DATE}</span>
                </Typography>
                <Typography variant='body'>
                    Developer: <span className='font-semibold'>{import.meta.env.VITE_DEVELOPER}</span>
                </Typography>
            </div>

            <div className="flex flex-col gap-y-2">

                <Typography variant="h2">
                    Let's Connect
                </Typography>

                <Typography variant="body" className="text-muted-foreground">
                    Whether you'd like to collaborate, report a bug, suggest a feature,
                    or just say hello, I'd love to hear from you.
                </Typography>

                {/* <div className="flex-row-center gap-x-1.5">
                    <HandshakeIcon className='size-5' />
                    <Typography variant='body' weight='medium'>
                        Collaborate
                    </Typography>
                </div>
                <div className="flex-row-center gap-x-1.5">
                    <BugIcon className='size-5' />
                    <Typography variant='body' weight='medium'>
                        Report a Bug
                    </Typography>
                </div>
                <div className="flex-row-center gap-x-1.5">
                    <MessageCircleIcon className='size-5' />
                    <Typography variant='body' weight='medium'>
                        Get in Touch
                    </Typography>
                </div> */}

                <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                        href="https://t.me/alizs10"
                        className="bg-[#229ED9] hover:bg-[#1d8fc4] text-white border-0"
                        leftIcon={<SendIcon className="size-5" />}
                    >
                        <Typography variant='caption'>
                            @alizs10
                        </Typography>
                    </Button>
                    <Button
                        href="mailto:alizswork@gmail.com"
                        className="bg-[#EA4335] hover:bg-[#D93025] text-white border-0"
                        leftIcon={<MailIcon className="size-5" />}
                    >
                        <Typography variant='caption'>
                            alizswork@gmail.com
                        </Typography>
                    </Button>
                </div>

            </div>

            <div className="flex flex-col gap-y-2">

                <div className="flex-row-center gap-x-2">
                    <HeartIcon className='size-7 text-destructive' />
                    <Typography variant='h2'>
                        Support the Project
                    </Typography>
                </div>

                <Typography variant="body" className="text-muted-foreground">
                    Enjoying the extension? Your support helps fund future features and improvements.
                </Typography>



                <div className="mt-4 flex flex-col gap-y-1 w-full">
                    <Typography variant="label" className="">
                        {import.meta.env.VITE_WALLET_NETWORK}
                    </Typography>
                    <div className="flex-row-center gap-x-1">
                        <div className="w-full max-w-md">
                            <TextInput
                                className='text-sm md:text-base lg:text-lg w-full text-muted-foreground'
                                value={import.meta.env.VITE_WALLET_ADDRESS}
                                readOnly
                            />
                        </div>

                        <Button
                            onClick={handleCopy}
                            variant='success' size='icon' className='h-full overflow-clip'>
                            <AnimatePresence mode="wait" initial={false}>
                                {copied ? (
                                    <motion.div
                                        key={'copy-check'}
                                        initial={{ y: -25 }}
                                        animate={{ y: 0 }}
                                        exit={{ y: 25 }}
                                        transition={{
                                            ease: "linear",
                                            duration: .1
                                        }}
                                    >
                                        <CopyCheckIcon

                                            className="size-5 text-success" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={'copy'}
                                        initial={{ y: -25 }}
                                        animate={{ y: 0 }}
                                        exit={{ y: 25 }}
                                        transition={{
                                            ease: "linear",
                                            duration: .1
                                        }}
                                    >

                                        <CopyIcon className={`size-5`} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
