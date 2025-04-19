import type { Insight, PodcastStack, PodcastStacksResponse } from "@/lib/types"

// Group insights into podcast stacks
export function createPodcastStacks(insights: Insight[]): PodcastStack[] {
  const stacksMap = new Map<string, Insight[]>()

  // Group insights by thumbnail URL (podcast episode)
  insights.forEach((insight) => {
    if (!insight.thumbnail_url) return

    if (!stacksMap.has(insight.thumbnail_url)) {
      stacksMap.set(insight.thumbnail_url, [])
    }

    stacksMap.get(insight.thumbnail_url)?.push(insight)
  })

  // Convert map to array of podcast stacks
  return Array.from(stacksMap.entries())
    .filter(([_, insights]) => insights.length > 0)
    .map(([thumbnailUrl, insights]) => {
      // Sort insights by title for consistent ordering
      const sortedInsights = [...insights].sort((a, b) => a.title.localeCompare(b.title))

      // Use the first insight for metadata
      const firstInsight = sortedInsights[0]

      return {
        id: thumbnailUrl,
        thumbnailUrl,
        podcastName: firstInsight.source_context.podcast_name || "Unknown Podcast",
        episodeTitle: firstInsight.source_context.episode_title || "Unknown Episode",
        channelId: firstInsight.channelId,
        insights: sortedInsights,
        insightCount: sortedInsights.length,
        categories: [...new Set(sortedInsights.map((i) => i.category))],
        tags: [...new Set(sortedInsights.flatMap((i) => i.tags))],
        createdAt: firstInsight.createdAt,
      }
    })
    .sort((a, b) => {
      // Sort by date (newest first) if available, otherwise by episode title
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return a.episodeTitle.localeCompare(b.episodeTitle)
    })
}

// Get all unique categories from podcast stacks
export function getStackCategories(stacks: PodcastStack[]): string[] {
  return [...new Set(stacks.flatMap((stack) => stack.categories))].sort()
}

// Get all unique tags from podcast stacks
export function getStackTags(stacks: PodcastStack[]): string[] {
  return [...new Set(stacks.flatMap((stack) => stack.tags))].sort()
}

// Filter podcast stacks based on query parameters
export function filterPodcastStacks(
  stacks: PodcastStack[],
  { channelId, category, tags, search }: { channelId?: string; category?: string; tags?: string; search?: string },
): PodcastStack[] {
  return stacks.filter((stack) => {
    // Filter by channel ID
    if (channelId && stack.channelId !== channelId) {
      return false
    }

    // Filter by category
    if (category && !stack.categories.some((c) => c.toLowerCase().includes(category.toLowerCase()))) {
      return false
    }

    // Filter by tags
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim().toLowerCase())
      if (!tagList.some((tag) => stack.tags.some((t) => t.toLowerCase().includes(tag)))) {
        return false
      }
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      const matchesEpisode = stack.episodeTitle.toLowerCase().includes(searchLower)
      const matchesPodcast = stack.podcastName.toLowerCase().includes(searchLower)
      const matchesInsight = stack.insights.some(
        (insight) =>
          insight.title.toLowerCase().includes(searchLower) ||
          insight.problem_addressed.toLowerCase().includes(searchLower) ||
          insight.description.toLowerCase().includes(searchLower),
      )

      if (!matchesEpisode && !matchesPodcast && !matchesInsight) {
        return false
      }
    }

    return true
  })
}

// Paginate podcast stacks
export function paginatePodcastStacks(
  stacks: PodcastStack[],
  { limit = 10, offset = 0 }: { limit?: number; offset?: number },
): PodcastStacksResponse {
  const paginatedStacks = stacks.slice(offset, offset + limit)

  return {
    data: paginatedStacks,
    total: stacks.length,
  }
}
