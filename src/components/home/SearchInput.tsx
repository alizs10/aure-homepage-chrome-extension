import useWidth from '@/hooks/useWidth';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import Button from '../common/Button';
import TextInput from '../Form/TextInput';
import { getDestination } from './helpers/search';
import Suggestions, { type Suggestion } from './Suggestions';

export default function SearchInput() {
    const [searchValue, setSearchValue] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)

    const handleSuggestionSelect = (suggestion: Suggestion) => {
        // 🌟 CHANGED: Navigate in the current tab instead of opening a new one
        window.location.href = suggestion.url;
        setSearchValue('');
        setIsNavigating(false);
    };

    const handleSearchUpdate = (value: string) => {
        setSearchValue(value);
        setIsNavigating(true); // Enter navigation mode
    };

    useEffect(() => {
        const show = () => setShowSuggestions(true)
        const hide = () => setShowSuggestions(false)

        if (searchValue.length > 0 && !showSuggestions) show()
        if (searchValue.length === 0 && showSuggestions) hide()
    }, [searchValue.length, showSuggestions])

    function onChange(e: ChangeEvent<HTMLInputElement>) {

        setIsNavigating(false);
        setSearchValue(e.target.value);
    }

    function handleSearch() {
        const url = getDestination(searchValue);
        if (!url) return;

        // 🌟 CHANGED: Navigate in the current tab instead of chrome.tabs.create
        window.location.href = url;

        setSearchValue("");
        setIsNavigating(false);
    }

    const { width } = useWidth()

    const dynamicWidth = useMemo(() => {
        if (width >= 1024) return "4.5rem"
        if (width >= 768) return "4rem"
        return "3.5rem"
    }, [width])

    return (
        <div className="w-full flex flex-nowrap px-4 md:px-8 lg:px-10 h-12 md:h-14 lg:h-16 relative z-40">
            <motion.div
                initial={false}
                animate={{
                    width: searchValue ? `calc(100% - ${dynamicWidth})` : "100%",
                }}
                transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                }}
                className='z-30'
            >
                <TextInput
                    className="flex-1 mt-auto text-lg md:text-xl lg:text-2xl md:px-6 md:py-2.5 lg:px-10 lg:py-4 h-full"
                    placeholder="Search through web..."
                    value={searchValue}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                        // Reset navigation on destructive keys
                        if (e.key === "Backspace" || e.key === "Delete") {
                            setIsNavigating(false);
                        }
                    }}
                    autoFocus
                />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    width: searchValue ? dynamicWidth : "0rem",
                    opacity: searchValue ? 1 : 0,
                    x: searchValue ? 0 : 12,
                }}
                transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                }}
                className='z-30'
            >
                <Button
                    role='div'
                    onClick={handleSearch}
                    size='icon' className='h-full ml-2'>
                    <SearchIcon className='size-5 md:size-6 lg:size-7' />
                </Button>
            </motion.div>

            <AnimatePresence>
                {showSuggestions && (
                    <Suggestions
                        searchValue={searchValue}
                        isNavigating={isNavigating}
                        onSuggestionSelect={handleSuggestionSelect}
                        onSearchUpdate={handleSearchUpdate}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}