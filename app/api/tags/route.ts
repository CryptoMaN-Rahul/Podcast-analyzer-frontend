import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

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

    // Aggregate to get all tags and their frequencies
    const tagsAggregation = await collection
      .aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $match: { _id: { $ne: null, $ne: "" } } },
        { $sort: { count: -1 } },
        { $limit: 50 }, // Limit to top 50 tags
      ])
      .toArray()

    const tags = tagsAggregation.map((tag) => tag._id)

    await client.close()

    return NextResponse.json(tags)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}
