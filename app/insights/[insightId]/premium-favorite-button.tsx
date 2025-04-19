"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/lib/favorites"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"

interface PremiumFavoriteButtonProps {
  insightId: string
}

export function PremiumFavoriteButton({ insightId }: PremiumFavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFavorited = isFavorite(insightId)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    toggleFavorite(insightId)

    toast(isFavorited ? "Removed from favorites" : "Added to favorites", {
      description: isFavorited
        ? "This insight has been removed from your favorites."
        : "This insight has been added to your favorites.",
      icon: isFavorited ? null : "❤️",
    })

    setTimeout(() => setIsAnimating(false), 1000)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleClick}
            className={cn(
              "rounded-full h-10 w-10 transition-all duration-300 relative overflow-hidden",
              isFavorited ? "bg-primary/10 border-primary/20" : "",
            )}
          >
            <AnimatePresence mode="wait">
              {isAnimating && isFavorited && (
                <motion.div
                  key="heart-animation"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.5 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Heart className="h-12 w-12 text-primary fill-primary opacity-20" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={isAnimating && !isFavorited ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Heart
                className={cn("h-5 w-5 transition-all duration-300", isFavorited ? "fill-primary text-primary" : "")}
              />
            </motion.div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{isFavorited ? "Remove from favorites" : "Add to favorites"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
