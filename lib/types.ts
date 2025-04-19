export interface Insight {
  _id: string
  channelId: string
  insight_type: string
  title: string
  problem_addressed: string
  description: string
  category: string
  tags: string[]
  source_context: {
    podcast_name: string
    episode_title: string
  }
  thumbnail_url: string
  createdAt: string
}

export interface Channel {
  channelId: string
  channelName: string
}

export interface InsightsResponse {
  data: Insight[]
  total: number
}

export interface InsightsQueryParams {
  channelId?: string
  limit?: number
  offset?: number
  category?: string
  tags?: string
  search?: string
}

// New types for podcast stacks
export interface PodcastStack {
  id: string
  thumbnailUrl: string
  podcastName: string
  episodeTitle: string
  channelId: string
  insights: Insight[]
  insightCount: number
  categories: string[]
  tags: string[]
  createdAt: string
}

export interface PodcastStacksResponse {
  data: PodcastStack[]
  total: number
}

export interface PodcastStacksQueryParams {
  channelId?: string
  limit?: number
  offset?: number
  category?: string
  tags?: string
  search?: string
}
