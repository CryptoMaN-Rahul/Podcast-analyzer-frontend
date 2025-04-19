import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getPodcastStack } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Youtube, Layers, Radio } from "lucide-react"
import { getChannelName } from "@/lib/channel-mapping"
import { normalizeCategory } from "@/lib/category-utils"

interface PodcastStackPageProps {
  params: { stackId: string }
}

export default async function PodcastStackPage({ params }: PodcastStackPageProps) {
  // Decode the stackId from the URL
  const decodedStackId = decodeURIComponent(params.stackId)

  const stack = await getPodcastStack(decodedStackId)

  if (!stack) {
    notFound()
  }

  // Get proper channel name
  const channelName = getChannelName(stack.channelId, stack.podcastName)

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12 max-w-6xl">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="rounded-full h-10 w-10">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Radio className="h-3 w-3" />
                <span>Podcast</span>
              </Badge>
              <Badge variant="secondary">{channelName}</Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Layers className="h-3 w-3" />
                <span>{stack.insightCount} ideas</span>
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{stack.episodeTitle}</h1>
          </div>
        </div>

        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <Image
            src={stack.thumbnailUrl || `/placeholder.svg?height=480&width=854`}
            alt={stack.episodeTitle}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Youtube className="h-5 w-5 text-red-500" />
              <span className="font-medium">{stack.podcastName}</span>
            </div>
            <p className="text-sm opacity-90">{stack.episodeTitle}</p>
          </div>
        </div>

        <Tabs defaultValue="all-ideas" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
            <TabsTrigger value="all-ideas">All Ideas</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="all-ideas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stack.insights.map((insight, index) => (
                <Card key={insight._id} className="overflow-hidden h-full flex flex-col">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{index + 1}</span>
                      </div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <Badge variant="outline">{insight.insight_type}</Badge>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Problem Addressed</h3>
                        <p className="text-sm">{insight.problem_addressed}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                        <p className="text-sm line-clamp-4">{insight.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-4 pt-4 border-t">
                      {insight.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                      <Link href={`/insights/${insight._id}`}>View Full Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stack.categories.map((category) => (
                <Card key={category} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{normalizeCategory(category)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ideas related to {normalizeCategory(category)} from this podcast episode.
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/?category=${encodeURIComponent(category)}`}>
                        View All {normalizeCategory(category)} Ideas
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tags" className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {stack.tags.map((tag) => (
                <Link key={tag} href={`/?tags=${encodeURIComponent(tag)}`}>
                  <Badge
                    variant="outline"
                    className="px-3 py-1 text-sm hover:bg-primary/10 hover:text-primary cursor-pointer"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
