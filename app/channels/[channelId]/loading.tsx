"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { AdvancedSkeletonLoader } from "@/components/advanced-skeleton-loader"

export default function ChannelLoading() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-9 w-[250px]" />
          </div>
        </div>

        <AdvancedSkeletonLoader count={9} />
      </div>
    </div>
  )
}
