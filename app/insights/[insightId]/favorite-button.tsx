"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/lib/favorites"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FavoriteButtonProps {
  insightId: string
}

export function FavoriteButton({ insightId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFavorited = isFavorite(insightId)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleFavorite(insightId)}
            className={cn(
              "rounded-full h-10 w-10 transition-all duration-300",
              isFavorited ? "bg-primary/10 border-primary/20" : "",
            )}
          >
            <Heart
              className={cn("h-5 w-5 transition-all duration-300", isFavorited ? "fill-primary text-primary" : "")}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isFavorited ? "Remove from favorites" : "Add to favorites"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
