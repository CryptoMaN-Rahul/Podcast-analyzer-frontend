"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Heart, Lightbulb, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Insight } from "@/lib/types"
import { useFavorites } from "@/lib/favorites"
import { cn } from "@/lib/utils"
import { getChannelName } from "@/lib/channel-mapping"

interface InsightCardProps {
  insight: Insight
  variant?: "default" | "compact"
}

export function InsightCard({ insight, variant = "default" }: InsightCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFavorited = isFavorite(insight._id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(insight._id)
  }

  // Use the channel mapping to get the proper channel name
  const channelName = getChannelName(insight.channelId, insight.source_context.podcast_name)

  return (
    <Card
      className={cn(
        "h-full overflow-hidden flex flex-col transition-all duration-300 group",
        "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
        variant === "compact" ? "border-0 shadow-none" : "",
      )}
    >
      <Link href={`/insights/${insight._id}`} className="flex-1 flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={insight.thumbnail_url || `/placeholder.svg?height=180&width=320`}
            alt={insight.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                  onClick={handleFavoriteClick}
                >
                  <Heart className={cn("h-5 w-5", isFavorited && "fill-primary text-primary")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFavorited ? "Remove from favorites" : "Add to favorites"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Badge variant="outline" className="px-2 py-0 h-5 text-xs font-normal">
              {channelName}
            </Badge>
            {insight.category && (
              <Badge variant="secondary" className="px-2 py-0 h-5 text-xs font-normal">
                {insight.category}
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {insight.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{insight.problem_addressed}</p>
          <div className="flex flex-wrap gap-1 mt-auto">
            <div className="flex items-center text-xs text-muted-foreground">
              <Lightbulb className="h-3 w-3 mr-1" />
              <span>Idea</span>
            </div>
            {insight.tags.length > 0 && (
              <div className="flex items-center text-xs text-muted-foreground ml-2">
                <Tag className="h-3 w-3 mr-1" />
                <span>{insight.tags.length} tags</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="px-4 py-2 text-xs text-muted-foreground border-t">
          {insight.createdAt && (
            <time dateTime={insight.createdAt}>
              {formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true })}
            </time>
          )}
        </CardFooter>
      </Link>
    </Card>
  )
}
