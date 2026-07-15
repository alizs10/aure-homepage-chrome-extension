import useWidth from '@/hooks/useWidth';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon, TerminalIcon } from 'lucide-react';
import { useMemo, useState, type ChangeEvent } from 'react';
import Button from '../common/Button';
import TextInput from '../Form/TextInput';
import { getDestination } from './helpers/search';
import Suggestions, { type Suggestion } from './Suggestions';
import { commands } from '@/lib/commands';

export default function SearchInput() {
    const [searchValue, setSearchValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    const isCommandMode = searchValue.startsWith('/');

    const handleSuggestionSelect = (suggestion: Suggestion) => {
        if (suggestion.source === "command") {
            const command = commands.find(c => c.id === suggestion.id);
            if (command) {
                const query = searchValue.slice(1).trim();
                const firstWord = query.split(' ')[0].toLowerCase();
                const isKeywordMatch = command.keywords.includes(firstWord);
                const trigger = isKeywordMatch ? firstWord : command.label.slice(1);

                const args = query.slice(trigger.length).trim();
                command.handler(args);

                setSearchValue('');
                setShowSuggestions(false);
            }
        } else {
            window.location.href = suggestion.url;
        }
    };

    const handleSearchUpdate = (value: string) => {
        setSearchValue(value);
        setIsNavigating(true);
    };

    // 🌟 REMOVED: The useEffect that was causing the cascading render warning.
    // State is now updated directly in the onChange handler below.

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        const newValue = e.target.value;
        setIsNavigating(false);
        setSearchValue(newValue);
        // 🌟 UPDATE: Show suggestions directly based on the new input value
        setShowSuggestions(newValue.length > 0);
    }

    function handleSearch() {
        // 1. Handle Command Mode Execution
        if (isCommandMode) {
            const query = searchValue.slice(1).trim();
            if (!query) {
                setShowSuggestions(false);
                return;
            }

            const firstWord = query.split(' ')[0].toLowerCase();
            const matchedCommand = commands.find(cmd =>
                cmd.label === `/${firstWord}` || cmd.keywords.includes(firstWord)
            );

            if (matchedCommand) {
                const args = query.slice(firstWord.length).trim();
                matchedCommand.handler(args);
                setSearchValue('');
                setShowSuggestions(false);
                return;
            }
            // If no command matches, hide suggestions and do nothing
            setShowSuggestions(false);
            return;
        }

        // 2. Handle Normal Web Search
        const url = getDestination(searchValue);
        if (!url) return;

        window.location.href = url;
        setSearchValue("");
        setShowSuggestions(false);
        setIsNavigating(false);
    }

    const { width } = useWidth();

    const dynamicWidth = useMemo(() => {
        if (width >= 1024) return "4.5rem";
        if (width >= 768) return "4rem";
        return "3.5rem";
    }, [width]);

    return (
        <div className="w-full flex flex-nowrap px-4 md:px-8 lg:px-10 h-12 md:h-14 lg:h-16 relative">
            <motion.div
                initial={false}
                animate={{
                    width: searchValue ? `calc(100% - ${dynamicWidth})` : "100%",
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className='z-30'
            >
                <TextInput
                    className={`flex-1 mt-auto text-lg md:text-xl lg:text-2xl md:px-6 md:py-2.5 lg:px-10 lg:py-4 h-full  transition-colors duration-200 ${isCommandMode ? 'border-accent ring-1 ring-accent/20' : ''
                        }`}
                    placeholder={isCommandMode ? "Type a command..." : "Search through web..."}
                    value={searchValue}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault(); // Prevent form submission if wrapped in a form
                            handleSearch();
                        } else if (e.key === "Escape") {
                            // 🌟 NEW: Allow user to dismiss suggestions with Escape
                            setShowSuggestions(false);
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
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className='z-30'
            >
                <Button
                    role='div'
                    onClick={handleSearch}
                    size='icon'
                    className='h-full ml-2'
                >
                    {isCommandMode ? <TerminalIcon className='size-5 md:size-6 lg:size-7' /> : <SearchIcon className='size-5 md:size-6 lg:size-7' />}
                </Button>
            </motion.div>

            <AnimatePresence>
                {showSuggestions && (
                    <Suggestions
                        searchValue={searchValue}
                        isCommandMode={isCommandMode}
                        isNavigating={isNavigating}
                        onSuggestionSelect={handleSuggestionSelect}
                        onSearchUpdate={handleSearchUpdate}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}