import { type PropsWithChildren } from 'react'
import Background from '../components/common/Background'
import MyToaster from '@/components/common/MyToaster'
export default function Layout({ children }: PropsWithChildren) {


    return (
        <div

            className="relative min-h-screen overflow-x-clip z-0 flex items-center justify-center">
            {children}


            <Background />
            <MyToaster />
        </div>
    )
}
