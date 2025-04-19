"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Layers, ChevronRight, Radio, Tag, Youtube, ExternalLink, Calendar } from "lucide-react"
import { Card, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import { getChannelName } from "@/lib/channel-mapping"
import { SearchHighlight } from "@/components/search-highlight"
import type { PodcastStack } from "@/lib/types"

interface PodcastStackCardProps {
  stack: PodcastStack
  variant?: "default" | "compact" | "featured"
  index?: number
}

export function PodcastStackCard({ stack, variant = "default", index = 0 }: PodcastStackCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const channelName = getChannelName(stack.channelId, stack.podcastName)

  // Get the first 3 insights for preview
  const previewInsights = stack.insights.slice(0, 3)

  // Encode the stack ID for the URL
  const encodedStackId = encodeURIComponent(stack.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card
        className={cn(
          "h-full overflow-hidden flex flex-col card-highlight transition-all duration-300",
          "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
          variant === "compact" ? "border-0 shadow-none" : "",
          variant === "featured" ? "md:flex-row" : "",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={`/podcast-stacks/${encodedStackId}`}
          className={cn("flex-1 flex flex-col", variant === "featured" ? "md:flex-row" : "")}
        >
          <div className={cn("relative aspect-video overflow-hidden", variant === "featured" ? "md:w-2/5" : "")}>
            <Image
              src={stack.thumbnailUrl || `/placeholder.svg?height=180&width=320`}
              alt={stack.episodeTitle}
              fill
              className={cn("object-cover transition-transform duration-500", isHovered ? "scale-105" : "")}
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-80",
              )}
            ></div>

            <div className="absolute top-2 left-2 flex gap-2">
              <Badge variant="secondary" className="bg-black/50 text-white border-0 flex items-center gap-1">
                <Layers className="h-3 w-3" />
                <span>{stack.insightCount} ideas</span>
              </Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Youtube className="h-4 w-4 text-red-500" />
                <span className="font-medium text-sm truncate">{stack.podcastName}</span>
              </div>
              <p className="text-xs opacity-90 truncate">{stack.episodeTitle}</p>
            </div>
          </div>

          <div className={cn("flex-1 p-4", variant === "featured" ? "md:w-3/5" : "")}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
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
                      <p className="text-xs text-muted-foreground">{stack.podcastName}</p>
                      <div className="flex items-center pt-2">
                        <Button variant="outline" size="sm" className="h-7 w-full text-xs" asChild>
                          <Link href={`/channels/${stack.channelId}`}>View Channel</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              {stack.categories.length > 0 && (
                <Badge variant="secondary" className="px-2 py-0 h-5 text-xs font-normal">
                  {stack.categories[0]}
                  {stack.categories.length > 1 && `+${stack.categories.length - 1}`}
                </Badge>
              )}
            </div>

            <h3
              className={cn(
                "font-semibold mb-3 transition-colors duration-300 group-hover:text-primary",
                variant === "featured" ? "text-xl" : "text-lg",
              )}
            >
              <SearchHighlight text={stack.episodeTitle} />
            </h3>

            <div className="space-y-2 mb-4">
              {previewInsights.map((insight, idx) => (
                <div
                  key={insight._id}
                  className={cn(
                    "flex items-start gap-2 text-sm",
                    idx < previewInsights.length - 1 ? "pb-2 border-b border-dashed border-muted" : "",
                  )}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs text-primary font-medium">{idx + 1}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium line-clamp-1">
                      <SearchHighlight text={insight.title} />
                    </p>
                    {variant !== "compact" && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        <SearchHighlight text={insight.problem_addressed} />
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {stack.insightCount > 3 && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span>+{stack.insightCount - 3} more ideas</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mt-auto">
              <div className="flex items-center text-xs text-muted-foreground">
                <Radio className="h-3 w-3 mr-1" />
                <span>Podcast</span>
              </div>

              {stack.tags.length > 0 && (
                <div className="flex items-center text-xs text-muted-foreground ml-2">
                  <Tag className="h-3 w-3 mr-1" />
                  <span>{stack.tags.length} tags</span>
                </div>
              )}
            </div>

            {stack.createdAt && variant !== "compact" && (
              <div className="pt-3 mt-3 border-t text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <time dateTime={stack.createdAt}>
                  {formatDistanceToNow(new Date(stack.createdAt), { addSuffix: true })}
                </time>
              </div>
            )}
          </div>
        </Link>

        {variant === "featured" && (
          <CardFooter className="p-4 pt-0 md:p-4 md:border-t-0 md:border-l">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/podcast-stacks/${encodedStackId}`}>
                <ExternalLink className="h-3 w-3 mr-2" />
                View All Ideas
              </Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}
