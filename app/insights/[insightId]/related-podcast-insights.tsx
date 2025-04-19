"use client"

import { useQuery } from "@tanstack/react-query"
import { PodcastInsightStack } from "@/components/podcast-insight-stack"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { getInsights } from "@/lib/api"
import { getRelatedPodcastInsights } from "@/lib/insight-utils"
import type { Insight } from "@/lib/types"

interface RelatedPodcastInsightsProps {
  insight: Insight
}

export function RelatedPodcastInsights({ insight }: RelatedPodcastInsightsProps) {
  // We need to fetch more insights to find related ones from the same podcast
  const { data, isLoading } = useQuery({
    queryKey: ["insights", { limit: 50 }],
    queryFn: () => getInsights({ limit: 50 }),
  })

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <Skeleton className="w-full aspect-video" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </Card>
    )
  }

  if (!data?.data.length || !insight.thumbnail_url) {
    return null
  }

  // Find related insights from the same podcast
  const relatedInsights = getRelatedPodcastInsights(insight, data.data)

  // If there are no related insights, don't render anything
  if (!relatedInsights.length) {
    return null
  }

  // Add the current insight to the stack for navigation
  const allInsights = [insight, ...relatedInsights]

  return <PodcastInsightStack insights={allInsights} currentInsightId={insight._id} />
}
