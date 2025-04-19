"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PodcastInsightStack } from "@/components/podcast-insight-stack"
import { AdvancedSkeletonLoader } from "@/components/advanced-skeleton-loader"
import { ErrorMessage } from "@/components/error-message"
import { getInsights } from "@/lib/api"
import { groupInsightsByPodcast } from "@/lib/insight-utils"
import { Radio, Layers, Podcast } from "lucide-react"

export function PodcastStacksSection() {
  const [selectedTab, setSelectedTab] = useState("popular")

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["insights", { limit: 50 }], // Fetch more insights to find stacks
    queryFn: () => getInsights({ limit: 50 }),
  })

  if (isLoading) {
    return <AdvancedSkeletonLoader count={3} viewMode="featured" />
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

  // Group insights by podcast (thumbnail URL)
  const groupedInsights = groupInsightsByPodcast(data?.data || [])

  // Convert to array for easier rendering
  const podcastStacks = Array.from(groupedInsights.entries()).map(([thumbnailUrl, insights]) => ({
    thumbnailUrl,
    insights,
  }))

  if (!podcastStacks.length) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Podcast Idea Stacks
          </h2>
          <p className="text-muted-foreground">Multiple business ideas extracted from the same podcast episodes</p>
        </div>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="popular">
              <Radio className="h-4 w-4 mr-1" />
              Popular
            </TabsTrigger>
            <TabsTrigger value="recent">
              <Podcast className="h-4 w-4 mr-1" />
              Recent
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {podcastStacks.slice(0, 6).map((stack, index) => (
          <motion.div
            key={stack.thumbnailUrl}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PodcastInsightStack insights={stack.insights} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
