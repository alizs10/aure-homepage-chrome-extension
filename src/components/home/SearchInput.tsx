import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import TextInput from '../Form/TextInput';
import Button from '../common/Button';
import { SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDestination } from './helpers/search';

export default function SearchInput() {

    const [searchValue, setSearchValue] = useState("")

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        setSearchValue(e.target.value)
    }

    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {

        if (!inputRef.current) return;

        inputRef.current.focus()

    }, [])

    function handleSearch() {
        const url = getDestination(searchValue);

        if (!url) return;

        chrome.tabs.create({ url });
        setSearchValue("");
    }

    return (
        <div className="w-full flex flex-nowrap px-4 md:px-8 lg:px-10">
            <motion.div
                // layout
                initial={false}
                animate={{
                    width: searchValue ? "calc(100% - 3rem)" : "100%",
                }}
                transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                }}
            >
                <TextInput
                    ref={inputRef}
                    className="flex-1 mt-auto text-lg md:text-xl lg:text-2xl md:px-6 md:py-2.5 lg:px-10 lg:py-4"
                    placeholder="Search through web..."
                    value={searchValue}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    width: searchValue ? "3rem" : "0rem",
                    opacity: searchValue ? 1 : 0,
                    x: searchValue ? 0 : 12,
                }}
                transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                }}
            >
                <Button
                    onClick={handleSearch}
                    size='icon' className='h-full ml-2'>
                    <SearchIcon className='size-5 md:size-6 lg:size-7' />
                </Button>
            </motion.div>

        </div>
    )
}
