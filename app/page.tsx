import { Suspense } from "react"
import { AdvancedHero } from "@/components/advanced-hero"
import { PremiumFilterSection } from "@/components/premium-filter-section"
import { PodcastStacksGrid } from "@/components/podcast-stacks-grid"
import { AdvancedSkeletonLoader } from "@/components/advanced-skeleton-loader"
import { PremiumStatsSection } from "@/components/premium-stats-section"
import { PremiumFeaturesSection } from "@/components/premium-features-section"
import { PremiumTestimonials } from "@/components/premium-testimonials"
import { PremiumCtaSection } from "@/components/premium-cta-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, Zap, Layers } from "lucide-react"

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const params = await searchParams;
  // Parse search parameters
  const channelId = typeof params.channelId === "string" ? params.channelId : undefined;
  const category = typeof params.category === "string" ? params.category : undefined;
  const tags = typeof params.tags === "string" ? params.tags : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;
  const limit = typeof params.limit === "string" ? Number.parseInt(params.limit) : 9;
  const offset = typeof params.offset === "string" ? Number.parseInt(params.offset) : 0;
  return (
    <div className="space-y-0">
      <AdvancedHero />

      <PremiumStatsSection />

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

          <PremiumFilterSection />

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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Trending Podcast Stacks
                </CardTitle>
                <CardDescription>The most popular podcast episodes based on user engagement.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-10">
                <div className="flex flex-col items-center text-center max-w-md">
                  <Zap className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Upgrade to Pro</h3>
                  <p className="text-muted-foreground mb-4">
                    Get access to trending podcast stacks and advanced analytics with our Pro plan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new">
            <Suspense fallback={<AdvancedSkeletonLoader count={6} />}>
              <PodcastStacksGrid limit={6} offset={0} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>

      <PremiumFeaturesSection />

      <PremiumTestimonials />

      <PremiumCtaSection />
    </div>
  )
}
