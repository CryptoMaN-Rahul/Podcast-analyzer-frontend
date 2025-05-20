"use client"

import { useQuery } from "@tanstack/react-query"
import { PodcastStackCard } from "@/components/podcast-stack-card"
import { Pagination } from "@/components/pagination"
import { ErrorMessage } from "@/components/error-message"
import { AdvancedSkeletonLoader } from "@/components/advanced-skeleton-loader"
import { getPodcastStacks } from "@/lib/api"
import { FileQuestion } from "lucide-react"
import { useEffect } from "react"

interface PodcastStacksGridProps {
  channelId?: string
  category?: string
  tags?: string
  search?: string
  limit?: number
  offset?: number
  sort?: "trending" | "newest"
}

export function PodcastStacksGrid({
  channelId,
  category,
  tags,
  search,
  limit = 9,
  offset = 0,
  sort,
}: PodcastStacksGridProps) {
  const queryParams = {
    channelId,
    category,
    tags,
    search,
    limit,
    offset,
    sort,
  }

  const { data, isLoading, isError, error, refetch, isPreviousData } = useQuery({
    queryKey: ["podcast-stacks", queryParams],
    queryFn: () => getPodcastStacks(queryParams),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })

  // Prefetch next page
  const { prefetchQuery } = useQuery()
  useEffect(() => {
    if (data?.data.length === limit) {
      prefetchQuery({
        queryKey: ["podcast-stacks", { channelId, category, tags, search, limit, offset: offset + limit, sort }],
        queryFn: () => getPodcastStacks({ channelId, category, tags, search, limit, offset: offset + limit, sort }),
      })
    }
  }, [data, limit, offset, prefetchQuery])

  if (isLoading) {
    return <AdvancedSkeletonLoader count={limit} />
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

  if (!data?.data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No podcast stacks found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((stack) => (
          <PodcastStackCard key={stack._id} stack={stack} searchTerm={search} />
        ))}
      </div>

      <Pagination total={data.total} limit={limit} offset={offset} isLoading={isPreviousData} />
    </div>
  )
}
