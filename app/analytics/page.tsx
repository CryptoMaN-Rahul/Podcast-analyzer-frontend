import { Suspense } from "react"
import { AnalyticsCharts } from "./analytics-charts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, PieChart } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <div className="flex flex-col items-start gap-4 md:gap-6 mb-8">
        <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
          <BarChart3 className="h-4 w-4" />
          Data Insights
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Visualize insights data across categories and channels to identify trends.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Insights by Category
                </CardTitle>
                <CardDescription>Distribution of insights across different business categories</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Suspense fallback={<Skeleton className="h-full w-full" />}>
                  <AnalyticsCharts type="category" />
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Insights by Channel
                </CardTitle>
                <CardDescription>Distribution of insights across different podcast channels</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Suspense fallback={<Skeleton className="h-full w-full" />}>
                  <AnalyticsCharts type="channel" />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Detailed Category Analysis
              </CardTitle>
              <CardDescription>In-depth breakdown of business ideas by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <AnalyticsCharts type="category" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Detailed Channel Analysis
              </CardTitle>
              <CardDescription>In-depth breakdown of business ideas by podcast channel</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <AnalyticsCharts type="channel" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
