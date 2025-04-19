import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function PodcastStackLoading() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-8 w-[300px]" />
          </div>
        </div>

        <Skeleton className="w-full aspect-video rounded-lg" />

        <div className="w-full max-w-md mx-auto">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-6 w-[200px]" />
                </div>
                <Skeleton className="h-5 w-20" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-1" />
                </div>

                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-1" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </div>

                <div className="flex gap-1 pt-4">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>

                <Skeleton className="h-9 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
