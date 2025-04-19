import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getChannels } from "@/lib/api"
import { PodcastStacksGrid } from "@/components/podcast-stacks-grid"
import { AdvancedSkeletonLoader } from "@/components/advanced-skeleton-loader"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Radio } from "lucide-react"
import { getChannelName } from "@/lib/channel-mapping"

interface ChannelPageProps {
  params: { channelId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ChannelPage({ params, searchParams }: ChannelPageProps) {
  const { channelId } = params

  // Parse search parameters
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const tags = typeof searchParams.tags === "string" ? searchParams.tags : undefined
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined
  const limit = typeof searchParams.limit === "string" ? Number.parseInt(searchParams.limit) : 9
  const offset = typeof searchParams.offset === "string" ? Number.parseInt(searchParams.offset) : 0

  // Fetch all channels to get the channel name
  const channels = await getChannels()
  const channel = channels.find((c) => c.channelId === channelId)

  if (!channel) {
    notFound()
  }

  const channelName = getChannelName(channelId, channel.channelName)

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Channel</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{channelName}</h1>
          </div>
        </div>

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
      </div>
    </div>
  )
}
