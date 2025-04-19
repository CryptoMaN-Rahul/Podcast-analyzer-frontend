import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

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
  const tags = searchParams.get("tags")
  const search = searchParams.get("search") || undefined

  try {
    const client = new MongoClient(uri)
    await client.connect()

    const database = client.db()
    const collection = database.collection("channel_insights")

    // Build query filter
    const filter: any = {}

    if (channelId) {
      filter.channelId = channelId
    }

    if (category) {
      // Use a case-insensitive regex for category matching
      filter.category = { $regex: new RegExp(category, "i") }
    }

    if (tags) {
      // Split tags and create an array of regex patterns for more flexible matching
      const tagPatterns = tags.split(",").map((tag) => new RegExp(tag.trim(), "i"))
      filter.tags = { $in: tagPatterns }
    }

    if (search) {
      // Improved search with multiple fields and word boundaries
      const searchRegex = new RegExp(search.split(/\s+/).join("|"), "i")
      filter.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { problem_addressed: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        { tags: { $in: [searchRegex] } },
        { "source_context.podcast_name": { $regex: searchRegex } },
        { "source_context.episode_title": { $regex: searchRegex } },
      ]
    }

    // Get total count for pagination
    const total = await collection.countDocuments(filter)

    // Get insights with pagination
    const insights = await collection.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).toArray()

    await client.close()

    return NextResponse.json({
      data: insights,
      total,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
  }
}
