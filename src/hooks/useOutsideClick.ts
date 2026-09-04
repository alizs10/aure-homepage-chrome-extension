import { useEffect, useRef } from "react"

export default function useClickOutside<T extends HTMLElement = HTMLDivElement>(handler: () => void) {
    const domRef = useRef<T>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent | TouchEvent) {
            if (domRef.current && !domRef.current.contains(event.target as Node)) {
                handler()
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [handler])

    return domRef
}