import { Suspense } from "react"
import { AdvancedHero } from "@/components/advanced-hero"
import { FilterSection } from "@/components/filter-section"
import { PodcastStacksGrid } from "@/components/podcast-stacks-grid"
import { AdvancedSkeletonLoader } from "@/components/advanced-skeleton-loader"
import { StatsSection } from "@/components/stats-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, TrendingUp, Layers } from "lucide-react"

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse search parameters
  const channelId = typeof searchParams.channelId === "string" ? searchParams.channelId : undefined
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const tags = typeof searchParams.tags === "string" ? searchParams.tags : undefined
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined
  const limit = typeof searchParams.limit === "string" ? Number.parseInt(searchParams.limit) : 9
  const offset = typeof searchParams.offset === "string" ? Number.parseInt(searchParams.offset) : 0

  return (
    <div className="space-y-0">
      <AdvancedHero />

      <StatsSection />

      <div className="container px-4 md:px-6 py-16" id="podcast-stacks">
        <Tabs defaultValue="all" className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Layers className="h-7 w-7 text-primary" />
                Podcast Idea Stacks
              </h2>
              <p className="text-muted-foreground">
                Discover business ideas extracted from popular YouTube podcasts, grouped by episode.
              </p>
            </div>
            <TabsList>
              <TabsTrigger value="all">All Stacks</TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="h-4 w-4 mr-1" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="new">
                <Sparkles className="h-4 w-4 mr-1" />
                New
              </TabsTrigger>
            </TabsList>
          </div>

          <FilterSection />

          <TabsContent value="all" className="space-y-8">
            <Suspense fallback={<AdvancedSkeletonLoader count={limit} />}>
              <PodcastStacksGrid
                channelId={channelId}
                category={category}
                tags={tags}
                search={search}
                limit={limit}
                offset={offset}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="trending">
            <Suspense fallback={<AdvancedSkeletonLoader count={6} />}>
              <PodcastStacksGrid sort="trending" limit={6} offset={0} />
            </Suspense>
          </TabsContent>

          <TabsContent value="new">
            <Suspense fallback={<AdvancedSkeletonLoader count={6} />}>
              <PodcastStacksGrid sort="newest" limit={6} offset={0} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>

      <FeaturesSection />
      <Footer />
    </div>
  )
}
