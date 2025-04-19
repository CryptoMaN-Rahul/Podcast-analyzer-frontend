"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { PodcastStackCard } from "@/components/podcast-stack-card"
import { AdvancedPagination } from "@/components/advanced-pagination"
import { ErrorMessage } from "@/components/error-message"
import { AdvancedSkeletonLoader } from "@/components/advanced-skeleton-loader"
import { getPodcastStacks } from "@/lib/api"
import type { PodcastStacksQueryParams } from "@/lib/types"
import { FileQuestion, Filter, Grid3X3, LayoutGrid, List, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useSearch } from "@/contexts/search-context"

interface PodcastStacksGridProps extends PodcastStacksQueryParams {
  showControls?: boolean
}

export function PodcastStacksGrid({
  channelId,
  category,
  tags,
  search,
  limit = 12,
  offset = 0,
  showControls = true,
}: PodcastStacksGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "compact">("grid")
  const [sortBy, setSortBy] = useState<string>("newest")
  const { searchResults, isSearching } = useSearch()

  const queryParams: PodcastStacksQueryParams = {
    channelId,
    category,
    tags,
    search,
    limit,
    offset,
  }

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["podcast-stacks", queryParams],
    queryFn: () => getPodcastStacks(queryParams),
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
  })

  const handleSortChange = (value: string) => {
    setSortBy(value)
    // In a real app, you would update the query params to sort the data
  }

  // Determine if we should use search results or API results
  const isSearchActive = search && search.trim() !== "" && searchResults.length > 0
  const displayData = isSearchActive
    ? searchResults.map((result) => result.item).slice(offset, offset + limit)
    : data?.data || []
  const totalItems = isSearchActive ? searchResults.length : data?.total || 0

  if (isLoading || isSearching) {
    return <AdvancedSkeletonLoader count={limit} viewMode={viewMode} />
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Failed to load podcast stacks"
        message={(error as Error)?.message || "An unexpected error occurred"}
        retry={() => refetch()}
      />
    )
  }

  if (!displayData.length) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-full bg-muted p-6 mb-4">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">No podcast stacks found</h3>
        <p className="text-muted-foreground max-w-md">
          {search ? (
            <>
              No results found for <span className="font-medium">"{search}"</span>. Try adjusting your search terms or
              filters.
            </>
          ) : (
            "Try adjusting your filters to find what you're looking for."
          )}
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {showControls && (
        <motion.div
          className="flex flex-col sm:flex-row justify-between gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-9 w-9"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === "compact" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("compact")}
              className="h-9 w-9"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Compact view</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-9 w-9"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>

            <div className="text-sm text-muted-foreground ml-2">
              {isSearchActive ? (
                <span className="flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  {totalItems} results for "{search}"
                </span>
              ) : (
                <span>{totalItems} stacks</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most-ideas">Most Ideas</SelectItem>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="az">A-Z</SelectItem>
                <SelectItem value="za">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            viewMode === "grid" && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
            viewMode === "compact" && "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
            viewMode === "list" && "flex flex-col gap-4",
          )}
        >
          {displayData.map((stack, index) => (
            <PodcastStackCard
              key={stack.id}
              stack={stack}
              variant={viewMode === "compact" ? "compact" : viewMode === "list" ? "featured" : "default"}
              index={index}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <AdvancedPagination total={totalItems} limit={limit} offset={offset} />
    </div>
  )
}
