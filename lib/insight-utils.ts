import type { Insight, InsightsResponse } from "@/lib/types"

// Group insights by thumbnail URL
export function groupInsightsByPodcast(insights: Insight[]): Map<string, Insight[]> {
  const groupedInsights = new Map<string, Insight[]>()

  insights.forEach((insight) => {
    const thumbnailUrl = insight.thumbnail_url || "unknown"

    if (!groupedInsights.has(thumbnailUrl)) {
      groupedInsights.set(thumbnailUrl, [])
    }

    groupedInsights.get(thumbnailUrl)?.push(insight)
  })

  // Filter out groups with only one insight
  return new Map([...groupedInsights.entries()].filter(([_, insights]) => insights.length > 1))
}

// Get related insights from the same podcast
export function getRelatedPodcastInsights(insight: Insight, allInsights: Insight[]): Insight[] {
  if (!insight.thumbnail_url) return []

  return allInsights.filter((i) => i._id !== insight._id && i.thumbnail_url === insight.thumbnail_url)
}

// Get podcast episode title from insight
export function getPodcastEpisodeTitle(insight: Insight): string {
  return insight.source_context.episode_title || "Unknown Episode"
}

// Get podcast name from insight
export function getPodcastName(insight: Insight): string {
  return insight.source_context.podcast_name || "Unknown Podcast"
}

// Fetch insights with filtering options
export async function getInsights({
  channelId,
  category,
  tags,
  search,
  limit = 9,
  offset = 0,
  sort = "newest",
}: {
  channelId?: string
  category?: string
  tags?: string
  search?: string
  limit?: number
  offset?: number
  sort?: string
}): Promise<InsightsResponse> {
  // Build query parameters
  const params = new URLSearchParams()
  if (channelId) params.append("channelId", channelId)
  if (category) params.append("category", category)
  if (tags) params.append("tags", tags)
  if (search) params.append("search", search)
  if (limit) params.append("limit", limit.toString())
  if (offset) params.append("offset", offset.toString())
  if (sort) params.append("sort", sort)

  // Fetch insights from API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
  const response = await fetch(`${apiUrl}/insights?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch insights: ${response.statusText}`)
  }

  return response.json()
}

// Get a single insight by ID
export async function getInsight(insightId: string): Promise<Insight> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api"
  const response = await fetch(`${apiUrl}/insights/${insightId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch insight: ${response.statusText}`)
  }

  return response.json()
}
