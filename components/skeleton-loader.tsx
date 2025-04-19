import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function InsightCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <div className="relative aspect-video">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="flex-1 p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex gap-2 mt-auto">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 border-t">
        <Skeleton className="h-3 w-24" />
      </CardFooter>
    </Card>
  )
}

export function InsightCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <InsightCardSkeleton key={i} />
      ))}
    </div>
  )
}
