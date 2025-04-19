import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getInsight } from "@/lib/api"
import { FavoriteButton } from "./favorite-button"
import { ExportButtons } from "./export-buttons"
import { RelatedPodcastInsights } from "./related-podcast-insights"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Youtube } from "lucide-react"
import { getChannelName } from "@/lib/channel-mapping"

interface InsightPageProps {
  params: { insightId: string }
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { insightId } = params
  const insight = await getInsight(insightId)

  if (!insight) {
    notFound()
  }

  const channelName = getChannelName(insight.channelId, insight.source_context.podcast_name)

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10 max-w-5xl mx-auto">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="px-2 py-0 h-5 text-xs font-normal">
                {insight.insight_type}
              </Badge>
              <Badge variant="secondary" className="px-2 py-0 h-5 text-xs font-normal">
                {insight.category}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{insight.title}</h1>
          </div>
        </div>

        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={insight.thumbnail_url || `/placeholder.svg?height=480&width=854`}
            alt={insight.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Youtube className="h-5 w-5 text-red-500" />
              <span className="font-medium">{insight.source_context.podcast_name}</span>
            </div>
            <p className="text-sm opacity-90">{insight.source_context.episode_title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Problem Addressed</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{insight.problem_addressed}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Idea Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{insight.description}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Youtube className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{channelName}</h3>
                    <p className="text-sm text-muted-foreground">{insight.source_context.podcast_name}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/channels/${insight.channelId}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Channel
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {insight.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <FavoriteButton insightId={insight._id} />
              <ExportButtons insight={insight} />
            </div>

            <Suspense
              fallback={
                <Card className="overflow-hidden">
                  <Skeleton className="w-full aspect-video" />
                </Card>
              }
            >
              <RelatedPodcastInsights insight={insight} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
