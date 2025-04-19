"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { AdvancedInsightCard } from "@/components/advanced-insight-card"
import { AdvancedSkeletonLoader } from "@/components/advanced-skeleton-loader"
import { getInsights } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PremiumRelatedInsightsProps {
  insightId: string
  channelId?: string
}

export function PremiumRelatedInsights({ insightId, channelId }: PremiumRelatedInsightsProps) {
  const [page, setPage] = useState(0)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["related-insights", channelId, page],
    queryFn: () =>
      getInsights({
        channelId,
        limit: 3,
        offset: page * 3,
      }),
  })

  const filteredInsights = data?.data.filter((insight) => insight._id !== insightId) || []
  const hasMore = data?.total && data.total > (page + 1) * 3

  const nextPage = () => {
    if (hasMore) {
      setPage((prev) => prev + 1)
    }
  }

  const prevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Related Ideas</h2>
        </div>
        <AdvancedSkeletonLoader count={3} viewMode="compact" />
      </div>
    )
  }

  if (isError || filteredInsights.length === 0) {
    return null
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Related Ideas</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={prevPage}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={nextPage} disabled={!hasMore}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredInsights.map((insight, index) => (
          <AdvancedInsightCard key={insight._id} insight={insight} variant="compact" index={index} />
        ))}
      </div>
    </motion.div>
  )
}
