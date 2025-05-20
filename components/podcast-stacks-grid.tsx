"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { PodcastStackCard } from "@/components/podcast-stack-card"
import { AdvancedPagination } from "@/components/advanced-pagination"
import { ErrorMessage } from "@/components/error-message"
import { AdvancedSkeletonLoader } from "@/components/advanced-skeleton-loader"
import { getPodcastStacks } from "@/lib/api"
import { FileQuestion } from "lucide-react"

interface PodcastStacksGridProps {
  channelId?: string
  category?: string
  tags?: string
  search?: string
  limit?: number
  offset?: number
  sort?: "newest" | "trending" | "popular"
}

export function PodcastStacksGrid({
  channelId,
  category,
  tags,
  search,
  limit = 9,
  offset = 0,
  sort = "newest",
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

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["podcast-stacks", queryParams],
    queryFn: () => getPodcastStacks(queryParams),
  })

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
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((stack, index) => (
          <motion.div
            key={stack._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PodcastStackCard stack={stack} />
          </motion.div>
        ))}
      </div>

      <AdvancedPagination total={data.total} limit={limit} offset={offset} />
    </div>
  )
}
