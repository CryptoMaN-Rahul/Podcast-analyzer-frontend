"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getPodcastStacks } from "@/lib/api"
import { useDebounce } from "@/hooks/use-debounce"
import {
  searchPodcastStacks,
  generateSearchSuggestions,
  podcastStackSearchCache,
  type SearchResult,
} from "@/lib/search-utils"
import type { PodcastStack } from "@/lib/types"

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: SearchResult<PodcastStack>[]
  suggestions: string[]
  isLoading: boolean
  isSearching: boolean
  selectedSuggestion: number
  setSelectedSuggestion: (index: number) => void
  applySearch: () => void
  applySuggestion: (suggestion: string) => void
  clearSearch: () => void
  showSuggestions: boolean
  setShowSuggestions: (show: boolean) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

// Client component that uses searchParams
function SearchProviderInner({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult<PodcastStack>[]>([])

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fetch all podcast stacks for client-side searching
  const { data: stacksData, isLoading } = useQuery({
    queryKey: ["podcast-stacks-all"],
    queryFn: () => getPodcastStacks({ limit: 1000 }), // Get a large batch for client-side search
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
  })

  // Generate search suggestions when the debounced query changes
  useEffect(() => {
    if (!debouncedSearchQuery || !stacksData?.data) {
      setSuggestions([])
      return
    }

    if (debouncedSearchQuery.length < 2) {
      setSuggestions([])
      return
    }

    const newSuggestions = generateSearchSuggestions(debouncedSearchQuery, stacksData.data, 5)

    setSuggestions(newSuggestions)
    setSelectedSuggestion(-1)
    setShowSuggestions(newSuggestions.length > 0)
  }, [debouncedSearchQuery, stacksData?.data])

  // Perform search when the debounced query changes
  useEffect(() => {
    if (!stacksData?.data) return

    if (!debouncedSearchQuery) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Check cache first
    const cachedResults = podcastStackSearchCache.get(debouncedSearchQuery)

    if (cachedResults) {
      setSearchResults(cachedResults)
      setIsSearching(false)
      return
    }

    // Perform search in a non-blocking way
    const timer = setTimeout(() => {
      const results = searchPodcastStacks(stacksData.data, debouncedSearchQuery)
      setSearchResults(results)
      podcastStackSearchCache.set(debouncedSearchQuery, results)
      setIsSearching(false)
    }, 0)

    return () => clearTimeout(timer)
  }, [debouncedSearchQuery, stacksData?.data])

  // Apply search to URL
  const applySearch = useCallback(() => {
    if (!searchQuery.trim()) {
      clearSearch()
      return
    }

    const params = new URLSearchParams(searchParams.toString())

    params.set("search", searchQuery)
    params.delete("offset") // Reset pagination

    router.push(`?${params.toString()}`)
    setShowSuggestions(false)
  }, [searchQuery, searchParams, router])

  // Apply suggestion
  const applySuggestion = useCallback(
    (suggestion: string) => {
      setSearchQuery(suggestion)

      const params = new URLSearchParams(searchParams.toString())

      params.set("search", suggestion)
      params.delete("offset") // Reset pagination

      router.push(`?${params.toString()}`)
      setShowSuggestions(false)
    },
    [searchParams, router],
  )

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("")

    const params = new URLSearchParams(searchParams.toString())

    params.delete("search")
    params.delete("offset") // Reset pagination

    router.push(`?${params.toString()}`)
    setShowSuggestions(false)
  }, [searchParams, router])

  // Handle keyboard navigation for suggestions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : prev))
          break
        case "Enter":
          e.preventDefault()
          if (selectedSuggestion >= 0 && selectedSuggestion < suggestions.length) {
            applySuggestion(suggestions[selectedSuggestion])
          } else {
            applySearch()
          }
          break
        case "Escape":
          e.preventDefault()
          setShowSuggestions(false)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showSuggestions, suggestions, selectedSuggestion, applySuggestion, applySearch])

  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestions,
    isLoading,
    isSearching,
    selectedSuggestion,
    setSelectedSuggestion,
    applySearch,
    applySuggestion,
    clearSearch,
    showSuggestions,
    setShowSuggestions,
  }

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

// Wrapper component that doesn't directly use searchParams
export function SearchProvider({ children }: { children: ReactNode }) {
  return <SearchProviderInner>{children}</SearchProviderInner>
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
