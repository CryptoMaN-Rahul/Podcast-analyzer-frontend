import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { channelIdToName } from "@/lib/channel-mapping"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Please add your MongoDB connection string to .env.local")
}

export async function GET() {
  try {
    const client = new MongoClient(uri)
    await client.connect()

    const database = client.db()
    const collection = database.collection("channel_insights")

    // Aggregate to get unique channels with their names
    const channels = await collection
      .aggregate([
        {
          $group: {
            _id: "$channelId",
            originalChannelName: { $first: "$source_context.podcast_name" },
          },
        },
        {
          $project: {
            _id: 0,
            channelId: "$_id",
            originalChannelName: 1,
          },
        },
        {
          $sort: { originalChannelName: 1 },
        },
      ])
      .toArray()

    // Map channel IDs to proper names
    const mappedChannels = channels.map((channel) => ({
      channelId: channel.channelId,
      channelName: channelIdToName[channel.channelId] || channel.originalChannelName,
    }))

    await client.close()

    return NextResponse.json(mappedChannels)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch channels" }, { status: 500 })
  }
}
