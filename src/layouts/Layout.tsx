import { type PropsWithChildren } from 'react'
import Background from '../components/common/Background'
export default function Layout({ children }: PropsWithChildren) {


    return (
        <div

            className="relative h-screen max-h-screen overflow-clip z-0 flex items-center justify-center">
            {children}


            <Background />
        </div>
    )
}
