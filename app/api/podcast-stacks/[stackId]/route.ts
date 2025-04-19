import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { createPodcastStacks } from "@/lib/podcast-stack-utils"
import type { Insight } from "@/lib/types"

// Get MongoDB connection string from environment variable
const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Please add your MongoDB connection string to .env.local")
}

export async function GET(request: NextRequest, { params }: { params: { stackId: string } }) {
  const { stackId } = params

  if (!stackId) {
    return NextResponse.json({ error: "Stack ID is required" }, { status: 400 })
  }

  try {
    // Decode the stackId
    const decodedStackId = decodeURIComponent(stackId)

    const client = new MongoClient(uri)
    await client.connect()

    const database = client.db()
    const collection = database.collection("channel_insights")

    // Find all insights with the matching thumbnail URL (stackId)
    const insights = (await collection
      .find({ thumbnail_url: decodedStackId })
      .sort({ title: 1 })
      .toArray()) as Insight[]

    await client.close()

    if (!insights.length) {
      return NextResponse.json({ error: "Podcast stack not found" }, { status: 404 })
    }

    // Create podcast stacks from insights
    const stacks = createPodcastStacks(insights)

    // Find the matching stack
    const stack = stacks.find((s) => s.id === decodedStackId)

    if (!stack) {
      return NextResponse.json({ error: "Podcast stack not found" }, { status: 404 })
    }

    return NextResponse.json(stack)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch podcast stack" }, { status: 500 })
  }
}
