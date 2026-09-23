import { SearchIcon, TerminalIcon } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import Button from '../ui/Button';
import TextInput from '../ui/TextInput';
import { getDestination } from './helpers/search';
import Suggestions, { type Suggestion } from './Suggestions';
import { commands } from '@/lib/commands';
import useClickOutside from '@/hooks/useOutsideClick';
import { motion } from "framer-motion";
import useWidth from '@/hooks/useWidth';

export default function SearchInput() {
    const [searchValue, setSearchValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [highlightedSuggestion, setHighlightedSuggestion] = useState<Suggestion | null>(null); // 🌟 Track keyboard selection

    const { width } = useWidth();

    const isCommandMode = searchValue.startsWith('/');

    const wrapperRef = useClickOutside(() => {
        setShowSuggestions(false);
    });

    const buttonSpace =
        width >= 1024
            ? '4.5rem'
            : width >= 768
                ? '4rem'
                : '3.5rem';

    function handleSuggestionSelect(suggestion: Suggestion) {
        if (suggestion.source === 'command') {
            const command = commands.find(
                (command) => command.id === suggestion.id,
            );

            if (command) {
                const query = searchValue.slice(1).trim();
                const firstWord = query.split(' ')[0].toLowerCase();

                const isKeywordMatch =
                    command.keywords.includes(firstWord);

                const trigger = isKeywordMatch
                    ? firstWord
                    : command.label.slice(1);

                const args = query.slice(trigger.length).trim();

                command.handler(args);

                setSearchValue('');
                setShowSuggestions(false);
            }

            return;
        }

        if (
            suggestion.url &&
            suggestion.url !== '#' &&
            suggestion.url !== 'undefined'
        ) {
            window.location.href = suggestion.url;
        } else {
            console.warn(
                'Attempted to navigate to invalid URL:',
                suggestion.url,
            );
        }
    }

    function handleSearchUpdate(value: string) {
        setSearchValue(value);
        setIsNavigating(true);
    }

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        const newValue = e.target.value;

        setSearchValue(newValue);
        setIsNavigating(false);
        setShowSuggestions(newValue.length > 0);
        setHighlightedSuggestion(null); // 🌟 Clear highlight when user types
    }

    function handleSearch() {
        // 🌟 FIX: If a website suggestion is highlighted via keyboard, navigate to its URL directly
        // This prevents searching Google for the label (e.g. "GitHub") instead of going to the URL
        if (
            highlightedSuggestion &&
            highlightedSuggestion.source !== 'command' &&
            highlightedSuggestion.source !== 'google'
        ) {
            const dest = getDestination(highlightedSuggestion.url);
            if (dest) {
                window.location.href = dest;
                setSearchValue('');
                setShowSuggestions(false);
                setIsNavigating(false);
                setHighlightedSuggestion(null);
                return;
            }
        }

        // If a command is highlighted, execute it
        if (highlightedSuggestion?.source === 'command') {
            handleSuggestionSelect(highlightedSuggestion);
            setHighlightedSuggestion(null);
            return;
        }

        // ---------------------------------------------------------
        // Command mode
        // ---------------------------------------------------------

        if (isCommandMode) {
            const query = searchValue.slice(1).trim();

            if (!query) {
                setShowSuggestions(false);
                return;
            }

            const firstWord = query.split(' ')[0].toLowerCase();

            const matchedCommand = commands.find(
                (command) =>
                    command.label === `/${firstWord}` ||
                    command.keywords.includes(firstWord),
            );

            if (matchedCommand) {
                const args = query.slice(firstWord.length).trim();

                matchedCommand.handler(args);

                setSearchValue('');
                setShowSuggestions(false);

                return;
            }

            setShowSuggestions(false);

            return;
        }

        // ---------------------------------------------------------
        // Normal web search
        // ---------------------------------------------------------

        const url = getDestination(searchValue);

        if (!url) {
            return;
        }

        window.location.href = url;

        setSearchValue('');
        setShowSuggestions(false);
        setIsNavigating(false);
    }

    return (
        <div ref={wrapperRef} className="relative flex h-12 w-full flex-nowrap px-4 md:h-14 md:px-8 lg:h-16 lg:px-10">
            <div className="flex min-w-0 flex-1 flex-nowrap overflow-clip rounded-3xl pointer-events-auto">
                <motion.div
                    initial={false}
                    animate={{
                        width: searchValue
                            ? `calc(100% - ${buttonSpace})`
                            : '100%',
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                    }}
                    className="z-30 shrink-0"
                >
                    <TextInput
                        className={`h-full w-full text-sm sm:px-6 sm:text-lg md:py-2.5 md:text-xl lg:px-10 lg:py-4 lg:text-2xl`}
                        placeholder={
                            isCommandMode
                                ? 'Type a command...'
                                : 'Search through web...'
                        }
                        value={searchValue}
                        onChange={onChange}
                        onFocus={() => {
                            if (searchValue.length > 0) {
                                setShowSuggestions(true);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearch();
                                return;
                            }

                            if (e.key === 'Escape') {
                                setShowSuggestions(false);
                            }

                            if (
                                e.key === 'Backspace' ||
                                e.key === 'Delete'
                            ) {
                                setIsNavigating(false);
                            }
                        }}
                        autoFocus
                    />
                </motion.div>

                <div className="z-30 shrink-0">
                    <Button
                        role="div"
                        onClick={handleSearch}
                        size="icon"
                        className="ml-2 h-full"
                    >
                        {isCommandMode ? (
                            <TerminalIcon className="size-5 md:size-6 lg:size-7" />
                        ) : (
                            <SearchIcon className="size-5 md:size-6 lg:size-7" />
                        )}
                    </Button>
                </div>
            </div>

            {showSuggestions && (
                <Suggestions
                    searchValue={searchValue}
                    isCommandMode={isCommandMode}
                    isNavigating={isNavigating}
                    onSuggestionSelect={handleSuggestionSelect}
                    onSearchUpdate={handleSearchUpdate}
                    onHighlight={setHighlightedSuggestion} // 🌟 Pass state setter
                />
            )}
        </div>
    );
}