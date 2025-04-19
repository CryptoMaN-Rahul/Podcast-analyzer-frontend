import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { createPodcastStacks, filterPodcastStacks, paginatePodcastStacks } from "@/lib/podcast-stack-utils"
import type { Insight } from "@/lib/types"

// Get MongoDB connection string from environment variable
const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Please add your MongoDB connection string to .env.local")
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // Parse query parameters
  const channelId = searchParams.get("channelId") || undefined
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
  const offset = Number.parseInt(searchParams.get("offset") || "0", 10)
  const category = searchParams.get("category") || undefined
  const tags = searchParams.get("tags") || undefined
  const search = searchParams.get("search") || undefined

  try {
    const client = new MongoClient(uri)
    await client.connect()

    const database = client.db()
    const collection = database.collection("channel_insights")

    // Build query filter for MongoDB
    const filter: any = {}

    if (channelId) {
      filter.channelId = channelId
    }

    // Get all insights
    const insights = (await collection.find(filter).sort({ createdAt: -1 }).toArray()) as Insight[]

    await client.close()

    // Create podcast stacks from insights
    const allStacks = createPodcastStacks(insights)

    // Apply filters
    const filteredStacks = filterPodcastStacks(allStacks, { category, tags, search })

    // Apply pagination
    const paginatedResponse = paginatePodcastStacks(filteredStacks, { limit, offset })

    return NextResponse.json(paginatedResponse)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch podcast stacks" }, { status: 500 })
  }
}
