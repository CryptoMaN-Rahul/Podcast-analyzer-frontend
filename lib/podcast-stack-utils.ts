import type { PodcastStack, PodcastStacksResponse } from "@/lib/types"
import { getInsights } from "@/lib/insight-utils"
import { channelMapping } from "@/lib/channel-mapping"

interface PodcastStacksParams {
  channelId?: string
  category?: string
  tags?: string
  search?: string
  limit?: number
  offset?: number
  sort?: string
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
}: PodcastStacksParams) {
  // Get insights first
  const insightsResponse = await getInsights({
    channelId,
    category,
    tags,
    search,
    limit: 100, // Get more to group them
    offset: 0,
  })
  const insights = insightsResponse.data

  // Group insights by episode
  const stacksMap = new Map<string, PodcastStack>()

  insights.forEach((insight) => {
    const episodeId = `${insight.source_context.podcast_name}-${insight.source_context.episode_title}`

    if (!stacksMap.has(episodeId)) {
      const channelInfo = Object.entries(channelMapping).find(
        ([_, name]) => name === insight.source_context.podcast_name,
      )

      stacksMap.set(episodeId, {
        _id: episodeId,
        podcast_name: insight.source_context.podcast_name,
        episode_title: insight.source_context.episode_title,
        channel_id: channelInfo ? channelInfo[0] : "unknown",
        insights: [],
        insight_count: 0,
        categories: [],
        tags: [],
        thumbnail: `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(
          insight.source_context.podcast_name,
        )}`,
        createdAt: insight.createdAt,
      })
    }

    const stack = stacksMap.get(episodeId)!
    stack.insights.push(insight)
    stack.insight_count += 1

    // Add categories and tags
    if (insight.category && !stack.categories.includes(insight.category)) {
      stack.categories.push(insight.category)
    }

    insight.tags.forEach((tag) => {
      if (!stack.tags.includes(tag)) {
        stack.tags.push(tag)
      }
    })
  })

  // Convert to array and sort
  const stacks = Array.from(stacksMap.values())

  // Apply sorting
  switch (sort) {
    case "newest":
      stacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case "oldest":
      stacks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case "trending":
    case "popular":
      stacks.sort((a, b) => b.insight_count - a.insight_count)
      break
    default:
      stacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Apply pagination
  const paginatedStacks = stacks.slice(offset, offset + limit)

  return {
    data: paginatedStacks,
    total: stacks.length,
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
