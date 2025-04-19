import axios from "axios"
import type {
  InsightsQueryParams,
  InsightsResponse,
  Insight,
  Channel,
  PodcastStack,
  PodcastStacksQueryParams,
  PodcastStacksResponse,
} from "@/lib/types"

// 1. Determine the absolute base URL for server-side execution
let absoluteBaseURL = ""
if (typeof window === "undefined") {
  // Check if running on the server
  if (process.env.VERCEL_URL) {
    absoluteBaseURL = `https://${process.env.VERCEL_URL}/api`
  } else {
    absoluteBaseURL = `http://localhost:${process.env.PORT || 3000}/api`
  }
  console.log(`[API Lib - Server] Determined Base URL: ${absoluteBaseURL}`)
} else {
  // Client-side
  absoluteBaseURL = "/api"
  console.log(`[API Lib - Client] Determined Base URL: ${absoluteBaseURL}`)
}

// 2. Create Axios instance (Only used by getInsights now)
const api = axios.create({
  baseURL: absoluteBaseURL,
})

// --- Helper function to create Auth headers FOR SERVER-SIDE CALLS ---
// Needed for getInsights when called server-side
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (typeof window === "undefined" && process.env.VERCEL_AUTOMATION_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.VERCEL_AUTOMATION_TOKEN}`
    console.log("[API Lib] Adding Vercel Automation Token to headers for internal call.")
  } else if (typeof window === "undefined") {
    console.warn("[API Lib] Server-side call detected, but VERCEL_AUTOMATION_TOKEN env var is not set.")
  }
  return headers
}

// --- API Functions ---

// getInsights using Axios (as data changes daily, avoids default static caching)
export async function getInsights(params: InsightsQueryParams = {}): Promise<InsightsResponse> {
  const requestPath = "/insights"
  const fetchURL = `${api.defaults.baseURL}${requestPath}`
  console.log(`[API Lib getInsights - Axios] Fetching ${fetchURL}`)
  try {
    // Get headers, including Auth token if server-side (needed for related insights call)
    const headers = getAuthHeaders()
    const { data } = await api.get(requestPath, { params, headers: headers })
    return data
  } catch (error: any) {
    console.error(
      `[API Lib getInsights - Axios] Error: Status ${error.response?.status}. Message: ${error.message}. URL: ${error.config?.url}`,
    )
    throw error
  }
}

// getInsight using fetch (data is static, use default caching)
export async function getInsight(insightId: string): Promise<Insight | null> {
  const requestPath = `/insights/${insightId}`
  const fetchURL = `${absoluteBaseURL}${requestPath}`
  console.log(`[API Lib getInsight - fetch] Attempting Fetch: ${fetchURL}`)
  try {
    // Get headers (includes Auth token if server-side)
    const headers = getAuthHeaders()
    const response = await fetch(fetchURL, {
      method: "GET",
      headers: headers,
      // NO cache directive here - use Next.js default caching (permanent)
    })
    console.log(`[API Lib getInsight - fetch] Response Status: ${response.status} for ID: ${insightId}`)
    if (response.status === 404) return null
    if (response.status === 401) throw new Error(`Request failed with status code 401`)
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
    const data = await response.json()
    return data
  } catch (error: any) {
    console.error(`[API Lib getInsight - fetch] CAUGHT ERROR for ID ${insightId}:`, error.message || error)
    throw error
  }
}

// getChannels using fetch (data is static, use default caching)
export async function getChannels(): Promise<Channel[]> {
  const requestPath = "/channels"
  const fetchURL = `${absoluteBaseURL}${requestPath}`
  console.log(`[API Lib getChannels - fetch] Fetching ${fetchURL}`)
  try {
    const headers = getAuthHeaders() // Include auth header if potentially needed server-side
    const response = await fetch(fetchURL, { headers: headers /*, cache defaults to 'force-cache' */ })
    console.log(`[API Lib getChannels - fetch] Response Status: ${response.status}`)
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
    const data = await response.json()
    return data
  } catch (error: any) {
    console.error(`[API Lib getChannels - fetch] Error:`, error.message || error)
    throw error
  }
}

// getCategories using fetch (data is static, use default caching)
export async function getCategories(): Promise<string[]> {
  const requestPath = "/categories"
  const fetchURL = `${absoluteBaseURL}${requestPath}`
  console.log(`[API Lib getCategories - fetch] Fetching ${fetchURL}`)
  try {
    const headers = getAuthHeaders() // Include auth header if potentially needed server-side
    const response = await fetch(fetchURL, { headers: headers })
    console.log(`[API Lib getCategories - fetch] Response Status: ${response.status}`)
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
    const data = await response.json()
    return data
  } catch (error: any) {
    console.error(`[API Lib getCategories - fetch] Error:`, error.message || error)
    throw error
  }
}

// getTags using fetch (data is static, use default caching)
export async function getTags(): Promise<string[]> {
  const requestPath = "/tags"
  const fetchURL = `${absoluteBaseURL}${requestPath}`
  console.log(`[API Lib getTags - fetch] Fetching ${fetchURL}`)
  try {
    const headers = getAuthHeaders() // Include auth header if potentially needed server-side
    const response = await fetch(fetchURL, { headers: headers })
    console.log(`[API Lib getTags - fetch] Response Status: ${response.status}`)
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
    const data = await response.json()
    return data
  } catch (error: any) {
    console.error(`[API Lib getTags - fetch] Error:`, error.message || error)
    throw error
  }
}

// getPodcastStacks using Axios
export async function getPodcastStacks(params: PodcastStacksQueryParams = {}): Promise<PodcastStacksResponse> {
  const requestPath = "/podcast-stacks"
  const fetchURL = `${api.defaults.baseURL}${requestPath}`
  console.log(`[API Lib getPodcastStacks - Axios] Fetching ${fetchURL}`)
  try {
    // Get headers, including Auth token if server-side
    const headers = getAuthHeaders()
    const { data } = await api.get(requestPath, { params, headers: headers })
    return data
  } catch (error: any) {
    console.error(
      `[API Lib getPodcastStacks - Axios] Error: Status ${error.response?.status}. Message: ${error.message}. URL: ${error.config?.url}`,
    )
    throw error
  }
}

// getPodcastStack using fetch
export async function getPodcastStack(stackId: string): Promise<PodcastStack | null> {
  const requestPath = `/podcast-stacks/${encodeURIComponent(stackId)}`
  const fetchURL = `${absoluteBaseURL}${requestPath}`
  console.log(`[API Lib getPodcastStack - fetch] Attempting Fetch: ${fetchURL}`)
  try {
    // Get headers (includes Auth token if server-side)
    const headers = getAuthHeaders()
    const response = await fetch(fetchURL, {
      method: "GET",
      headers: headers,
      // Use Next.js default caching (permanent)
    })
    console.log(`[API Lib getPodcastStack - fetch] Response Status: ${response.status} for ID: ${stackId}`)
    if (response.status === 404) return null
    if (response.status === 401) throw new Error(`Request failed with status code 401`)
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
    const data = await response.json()
    return data
  } catch (error: any) {
    console.error(`[API Lib getPodcastStack - fetch] CAUGHT ERROR for ID ${stackId}:`, error.message || error)
    throw error
  }
}
