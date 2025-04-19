"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Heart, Lightbulb, Tag, Share2, Bookmark, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import type { Insight } from "@/lib/types"
import { useFavorites } from "@/lib/favorites"
import { cn } from "@/lib/utils"
import { getChannelName } from "@/lib/channel-mapping"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AdvancedInsightCardProps {
  insight: Insight
  variant?: "default" | "compact" | "featured"
  index?: number
}

export function AdvancedInsightCard({ insight, variant = "default", index = 0 }: AdvancedInsightCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFavorited = isFavorite(insight._id)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(insight._id)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  // Use the channel mapping to get the proper channel name
  const channelName = getChannelName(insight.channelId, insight.source_context.podcast_name)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card
        ref={cardRef}
        className={cn(
          "h-full overflow-hidden flex flex-col card-highlight transition-all duration-300",
          "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
          variant === "compact" ? "border-0 shadow-none" : "",
          variant === "featured" ? "md:flex-row" : "",
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={
          {
            "--x": `${mousePosition.x}px`,
            "--y": `${mousePosition.y}px`,
          } as React.CSSProperties
        }
      >
        <Link
          href={`/insights/${insight._id}`}
          className={cn("flex-1 flex flex-col", variant === "featured" ? "md:flex-row" : "")}
        >
          <div className={cn("relative aspect-video overflow-hidden", variant === "featured" ? "md:w-2/5" : "")}>
            <Image
              src={insight.thumbnail_url || `/placeholder.svg?height=180&width=320`}
              alt={insight.title}
              fill
              className={cn("object-cover transition-transform duration-500", isHovered ? "scale-105" : "")}
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0",
              )}
            ></div>

            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-black/50 text-white border-0">
                {insight.insight_type}
              </Badge>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                    onClick={handleFavoriteClick}
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-all duration-300",
                        isFavorited ? "fill-primary text-primary scale-110" : "",
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isFavorited ? "Remove from favorites" : "Add to favorites"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {variant === "featured" && (
              <div className="absolute bottom-4 left-4 right-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button variant="secondary" size="sm" className="w-full gap-2">
                    <ExternalLink className="h-3 w-3" />
                    View Details
                  </Button>
                </motion.div>
              </div>
            )}
          </div>

          <div className={cn("flex-1 p-4", variant === "featured" ? "md:w-3/5" : "")}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Badge variant="outline" className="px-2 py-0 h-5 text-xs font-normal cursor-pointer">
                    {channelName}
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>{channelName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{channelName}</h4>
                      <p className="text-xs text-muted-foreground">{insight.source_context.episode_title}</p>
                      <div className="flex items-center pt-2">
                        <Button variant="outline" size="sm" className="h-7 w-full text-xs" asChild>
                          <Link href={`/channels/${insight.channelId}`}>View Channel</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              {insight.category && (
                <Badge variant="secondary" className="px-2 py-0 h-5 text-xs font-normal">
                  {insight.category}
                </Badge>
              )}
            </div>

            <h3
              className={cn(
                "font-semibold mb-2 transition-colors duration-300 group-hover:text-primary",
                variant === "featured" ? "text-xl line-clamp-2" : "text-lg line-clamp-2",
              )}
            >
              {insight.title}
            </h3>

            <p
              className={cn(
                "text-sm text-muted-foreground mb-3",
                variant === "compact" ? "line-clamp-2" : "line-clamp-3",
              )}
            >
              {insight.problem_addressed}
            </p>

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

              {variant === "featured" && (
                <div className="ml-auto flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                    <Bookmark className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {insight.createdAt && variant !== "compact" && (
              <div className="pt-3 mt-3 border-t text-xs text-muted-foreground">
                <time dateTime={insight.createdAt}>
                  {formatDistanceToNow(new Date(insight.createdAt), { addSuffix: true })}
                </time>
              </div>
            )}
          </div>
        </Link>
      </Card>
    </motion.div>
  )
}
