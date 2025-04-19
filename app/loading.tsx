import { Skeleton } from "@/components/ui/skeleton"
import { AdvancedSkeletonLoader } from "@/components/advanced-skeleton-loader"

export default function HomeLoading() {
  return (
    <div className="space-y-16">
      <div className="container px-4 md:px-6 pt-16 pb-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <Skeleton className="h-8 w-[180px]" />
          <Skeleton className="h-12 w-[350px] md:w-[550px]" />
          <Skeleton className="h-6 w-[300px] md:w-[450px]" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-lg" />
          ))}
        </div>
      </div>

      <div className="container px-4 md:px-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Skeleton className="h-8 w-[200px] mb-2" />
              <Skeleton className="h-5 w-[300px]" />
            </div>
            <Skeleton className="h-10 w-[200px]" />
          </div>

          <Skeleton className="h-12 w-full rounded-lg" />

          <AdvancedSkeletonLoader count={9} />
        </div>
      </div>
    </div>
  )
}
