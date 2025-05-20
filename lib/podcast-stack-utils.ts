import type { Insight, PodcastStack, PodcastStacksResponse } from "@/lib/types"

// Create podcast stacks from insights
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
        _id: thumbnailUrl,
        podcast_name: firstInsight.source_context.podcast_name || "Unknown Podcast",
        episode_title: firstInsight.source_context.episode_title || "Unknown Episode",
        channel_id: firstInsight.channelId,
        insights: sortedInsights,
        insight_count: sortedInsights.length,
        categories: [...new Set(sortedInsights.map((i) => i.category))],
        tags: [...new Set(sortedInsights.flatMap((i) => i.tags))],
        thumbnail: thumbnailUrl,
        createdAt: firstInsight.createdAt,
      }
    })
    .sort((a, b) => {
      // Sort by date (newest first) if available, otherwise by episode title
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return a.episode_title.localeCompare(b.episode_title)
    })
}

// Group insights into podcast stacks
export async function getPodcastStacks({
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
}) {
  // Get insights first
  const insightsResponse = await fetch(`/api/insights?limit=100`)
  const insights = await insightsResponse.json()

  // Create stacks using the createPodcastStacks function
  const stacks = createPodcastStacks(insights.data)

  // Filter stacks based on criteria
  const filteredStacks = filterPodcastStacks(stacks, { channelId, category, tags, search })

  // Apply sorting
  switch (sort) {
    case "newest":
      filteredStacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case "oldest":
      filteredStacks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case "trending":
    case "popular":
      filteredStacks.sort((a, b) => b.insight_count - a.insight_count)
      break
    default:
      filteredStacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Apply pagination
  const paginatedStacks = filteredStacks.slice(offset, offset + limit)

  return {
    data: paginatedStacks,
    total: filteredStacks.length,
  }
}

export async function getPodcastStack(stackId: string) {
  const allStacks = await getPodcastStacks({})
  return allStacks.data.find((stack) => stack._id === stackId)
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
    if (channelId && stack.channel_id !== channelId) {
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
      const matchesEpisode = stack.episode_title.toLowerCase().includes(searchLower)
      const matchesPodcast = stack.podcast_name.toLowerCase().includes(searchLower)
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
