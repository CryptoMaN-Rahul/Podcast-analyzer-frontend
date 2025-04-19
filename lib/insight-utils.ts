import type { Insight } from "@/lib/types"

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
