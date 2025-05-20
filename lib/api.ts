import axios from "axios"
import type { Insight, PodcastStack } from "@/lib/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

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
    const response = await axios.get(`${API_BASE_URL}/insights`, { params })
    return response.data
  } catch (error) {
    console.error("Error fetching insights:", error)
    throw new Error("Failed to fetch insights")
  }
}

export async function getInsight(insightId: string): Promise<Insight> {
  try {
    const response = await axios.get(`${API_BASE_URL}/insights/${insightId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching insight ${insightId}:`, error)
    throw new Error("Failed to fetch insight")
  }
}

export async function getPodcastStacks(params: InsightsQueryParams): Promise<PodcastStacksResponse> {
  try {
    const response = await axios.get(`${API_BASE_URL}/podcast-stacks`, { params })
    return response.data
  } catch (error) {
    console.error("Error fetching podcast stacks:", error)
    throw new Error("Failed to fetch podcast stacks")
  }
}

export async function getPodcastStack(stackId: string): Promise<PodcastStack> {
  try {
    const response = await axios.get(`${API_BASE_URL}/podcast-stacks/${stackId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching podcast stack ${stackId}:`, error)
    throw new Error("Failed to fetch podcast stack")
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`)
    return response.data
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw new Error("Failed to fetch categories")
  }
}

export async function getChannels(): Promise<{ id: string; name: string }[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/channels`)
    return response.data
  } catch (error) {
    console.error("Error fetching channels:", error)
    throw new Error("Failed to fetch channels")
  }
}

export async function getTags(): Promise<string[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/tags`)
    return response.data
  } catch (error) {
    console.error("Error fetching tags:", error)
    throw new Error("Failed to fetch tags")
  }
}
