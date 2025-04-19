import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsLoading() {
  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <div className="flex flex-col items-start gap-4 md:gap-6 mb-8">
        <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
      </div>

      <div className="space-y-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview" disabled>
              Overview
            </TabsTrigger>
            <TabsTrigger value="categories" disabled>
              Categories
            </TabsTrigger>
            <TabsTrigger value="channels" disabled>
              Channels
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-40" />
              </CardTitle>
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="h-80">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-40" />
              </CardTitle>
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="h-80">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
