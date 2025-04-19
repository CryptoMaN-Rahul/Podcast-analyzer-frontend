"use client"

import { useQuery } from "@tanstack/react-query"
import { InsightCard } from "@/components/insight-card"
import { Pagination } from "@/components/pagination"
import { ErrorMessage } from "@/components/error-message"
import { InsightCardSkeletonGrid } from "@/components/skeleton-loader"
import { getInsights } from "@/lib/api"
import type { InsightsQueryParams } from "@/lib/types"
import { FileQuestion } from "lucide-react"

interface InsightsGridProps extends InsightsQueryParams {}

export function InsightsGrid({ channelId, category, tags, search, limit = 12, offset = 0 }: InsightsGridProps) {
  const queryParams: InsightsQueryParams = {
    channelId,
    category,
    tags,
    search,
    limit,
    offset,
  }

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["insights", queryParams],
    queryFn: () => getInsights(queryParams),
  })

  if (isLoading) {
    return <InsightCardSkeletonGrid count={limit} />
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Failed to load insights"
        message={(error as Error)?.message || "An unexpected error occurred"}
        retry={() => refetch()}
      />
    )
  }

  if (!data?.data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No insights found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((insight) => (
          <InsightCard key={insight._id} insight={insight} />
        ))}
      </div>

      <Pagination total={data.total} limit={limit} offset={offset} />
    </div>
  )
}
