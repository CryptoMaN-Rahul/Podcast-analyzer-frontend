"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface AdvancedSkeletonLoaderProps {
  count?: number
  viewMode?: "grid" | "list" | "compact"
}

export function AdvancedSkeletonLoader({ count = 6, viewMode = "grid" }: AdvancedSkeletonLoaderProps) {
  return (
    <div
      className={cn(
        viewMode === "grid" && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        viewMode === "compact" && "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
        viewMode === "list" && "flex flex-col gap-4",
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} index={i} viewMode={viewMode} />
      ))}
    </div>
  )
}

function SkeletonCard({ index, viewMode }: { index: number; viewMode: "grid" | "list" | "compact" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card className={cn("h-full overflow-hidden flex flex-col", viewMode === "list" && "md:flex-row")}>
        <div
          className={cn(
            "relative aspect-video bg-shimmer bg-[length:200%_100%] animate-shimmer",
            viewMode === "list" && "md:w-2/5",
          )}
        >
          <Skeleton className="h-full w-full" />
        </div>
        <CardContent className={cn("flex-1 p-4", viewMode === "list" && "md:w-3/5")}>
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-full mb-2" />
          {viewMode !== "compact" && <Skeleton className="h-6 w-5/6 mb-2" />}
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-11/12 mb-2" />
          {viewMode !== "compact" && <Skeleton className="h-4 w-4/5 mb-4" />}
          <div className="flex gap-2 mt-auto">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          {viewMode !== "compact" && (
            <div className="mt-4 pt-4 border-t">
              <Skeleton className="h-3 w-24" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
