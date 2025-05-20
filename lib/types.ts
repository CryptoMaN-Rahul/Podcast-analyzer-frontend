export interface Insight {
  _id: string
  title: string
  description: string
  problem_addressed: string
  category: string
  tags: string[]
  channelId: string
  thumbnail_url?: string
  source_context: {
    podcast_name: string
    episode_title: string
    timestamp: string
  }
  createdAt: string
  updatedAt: string
}

export interface InsightsResponse {
  data: Insight[]
  total: number
}

export interface PodcastStack {
  _id: string
  podcast_name: string
  episode_title: string
  channel_id: string
  insights: Insight[]
  insight_count: number
  categories: string[]
  tags: string[]
  thumbnail: string
  createdAt: string
}

export interface PodcastStacksResponse {
  data: PodcastStack[]
  total: number
}

export interface Channel {
  id: string
  name: string
  insightCount: number
  thumbnail?: string
}

export interface ChannelsResponse {
  data: Channel[]
}

export interface Category {
  name: string
  count: number
}

export interface CategoriesResponse {
  data: Category[]
}

export interface Tag {
  name: string
  count: number
}

export interface TagsResponse {
  data: Tag[]
}
