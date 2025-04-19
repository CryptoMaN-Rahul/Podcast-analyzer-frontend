"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Youtube } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Insight } from "@/lib/types"
import { getPodcastEpisodeTitle, getPodcastName } from "@/lib/insight-utils"

interface PodcastInsightStackProps {
  insights: Insight[]
  currentInsightId?: string
  className?: string
}

export function PodcastInsightStack({ insights, currentInsightId, className }: PodcastInsightStackProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (currentInsightId) {
      const index = insights.findIndex((insight) => insight._id === currentInsightId)
      return index >= 0 ? index : 0
    }
    return 0
  })

  const currentInsight = insights[currentIndex]
  const totalInsights = insights.length

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalInsights) % totalInsights)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalInsights)
  }

  if (!insights.length || !currentInsight) return null

  const podcastName = getPodcastName(currentInsight)
  const episodeTitle = getPodcastEpisodeTitle(currentInsight)

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-muted/30 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-500" />
            <CardTitle className="text-base font-medium">From the same podcast episode</CardTitle>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{currentIndex + 1}</span>
            <span className="mx-1">/</span>
            <span>{totalInsights}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative aspect-video">
          <Image
            src={currentInsight.thumbnail_url || `/placeholder.svg?height=180&width=320`}
            alt={episodeTitle}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h4 className="font-medium text-sm mb-1">{podcastName}</h4>
              <p className="text-xs opacity-90">{episodeTitle}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentInsight._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-2 py-0 h-5 text-xs font-normal">
                  {currentInsight.category}
                </Badge>
                <Badge variant="secondary" className="px-2 py-0 h-5 text-xs font-normal">
                  {currentInsight.insight_type}
                </Badge>
              </div>

              <h3 className="font-semibold text-lg">{currentInsight.title}</h3>

              <p className="text-sm text-muted-foreground line-clamp-3">{currentInsight.problem_addressed}</p>

              <div className="flex flex-wrap gap-1 pt-2">
                {currentInsight.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-0 text-xs">
                    {tag}
                  </Badge>
                ))}
                {currentInsight.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{currentInsight.tags.length - 3} more
                  </Badge>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between p-3">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevious} disabled={totalInsights <= 1}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous insight</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext} disabled={totalInsights <= 1}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next insight</span>
          </Button>
        </div>

        <Button variant="default" size="sm" asChild>
          <Link href={`/insights/${currentInsight._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
