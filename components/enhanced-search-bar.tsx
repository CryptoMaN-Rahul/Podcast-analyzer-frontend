"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, ArrowRight, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearch } from "@/contexts/search-context"
import { useOnClickOutside } from "@/hooks/use-click-outside"
import { cn } from "@/lib/utils"

interface EnhancedSearchBarProps {
  className?: string
  placeholder?: string
  autoFocus?: boolean
}

export function EnhancedSearchBar({
  className,
  placeholder = "Search for podcast stacks, ideas, or topics...",
  autoFocus = false,
}: EnhancedSearchBarProps) {
  const {
    searchQuery,
    setSearchQuery,
    suggestions,
    isSearching,
    selectedSuggestion,
    setSelectedSuggestion,
    applySearch,
    applySuggestion,
    clearSearch,
    showSuggestions,
    setShowSuggestions,
  } = useSearch()

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close suggestions
  useOnClickOutside(containerRef, () => setShowSuggestions(false))

  // Auto focus input if specified
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          className="pl-10 pr-24"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            if (e.target.value.length > 1) {
              setShowSuggestions(true)
            }
          }}
          onFocus={() => {
            if (searchQuery.length > 1 && suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !showSuggestions) {
              applySearch()
            }
          }}
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isSearching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}

          {searchQuery && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearSearch}>
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}

          <Button size="sm" className="h-7" onClick={applySearch}>
            Search
          </Button>
        </div>
      </div>

      {/* Search suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-1 bg-background border rounded-md shadow-lg overflow-hidden"
          >
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm flex items-center justify-between",
                      "hover:bg-muted transition-colors duration-150",
                      selectedSuggestion === index && "bg-muted",
                    )}
                    onClick={() => applySuggestion(suggestion)}
                    onMouseEnter={() => setSelectedSuggestion(index)}
                  >
                    <div className="flex items-center">
                      <Search className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span>{suggestion}</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground opacity-50" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
