import axios from "axios"
import type { Insight, PodcastStack } from "@/lib/types"

// Create a configured axios instance with proper defaults
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV !== "production") {
      console.error("API Error:", error.response?.data || error.message)
    }

    // Customize error message based on status code
    if (error.response) {
      switch (error.response.status) {
        case 404:
          error.message = "Resource not found"
          break
        case 401:
          error.message = "Unauthorized access"
          break
        case 403:
          error.message = "Access forbidden"
          break
        case 500:
          error.message = "Server error, please try again later"
          break
        default:
          error.message = error.response.data?.message || "An unexpected error occurred"
      }
    } else if (error.request) {
      error.message = "No response from server, please check your connection"
    }

    return Promise.reject(error)
  },
)

export interface InsightsQueryParams {
  channelId?: string
  category?: string
  tags?: string
  search?: string
  limit?: number
  offset?: number
  sort?: string
}

export interface InsightsResponse {
  data: Insight[]
  total: number
}

export interface PodcastStacksResponse {
  data: PodcastStack[]
  total: number
}

export async function getInsights(params: InsightsQueryParams): Promise<InsightsResponse> {
  try {
    const { data } = await api.get("/insights", { params })
    return data
  } catch (error) {
    console.error("Error fetching insights:", error)
    throw error
  }
}

export async function getInsight(insightId: string): Promise<Insight> {
  try {
    const { data } = await api.get(`/insights/${insightId}`)
    return data
  } catch (error) {
    console.error(`Error fetching insight ${insightId}:`, error)
    throw error
  }
}

export async function getPodcastStacks(params: InsightsQueryParams): Promise<PodcastStacksResponse> {
  try {
    const { data } = await api.get("/podcast-stacks", { params })
    return data
  } catch (error) {
    console.error("Error fetching podcast stacks:", error)
    throw error
  }
}

export async function getPodcastStack(stackId: string): Promise<PodcastStack> {
  try {
    const { data } = await api.get(`/podcast-stacks/${stackId}`)
    return data
  } catch (error) {
    console.error(`Error fetching podcast stack ${stackId}:`, error)
    throw error
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const { data } = await api.get("/categories")
    return data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export async function getChannels(): Promise<{ id: string; name: string }[]> {
  try {
    const { data } = await api.get("/channels")
    return data
  } catch (error) {
    console.error("Error fetching channels:", error)
    throw error
  }
}

export async function getTags(): Promise<string[]> {
  try {
    const { data } = await api.get("/tags")
    return data
  } catch (error) {
    console.error("Error fetching tags:", error)
    throw error
  }
}
