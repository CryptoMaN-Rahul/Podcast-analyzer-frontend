import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Please add your MongoDB connection string to .env.local")
}

export async function GET(request: NextRequest, { params }: { params: { insightId: string } }) {
  const { insightId } = params

  try {
    const client = new MongoClient(uri)
    await client.connect()

    const database = client.db()
    const collection = database.collection("channel_insights")

    // Try to find by ObjectId first
    let insight = null

    try {
      const objectId = new ObjectId(insightId)
      insight = await collection.findOne({ _id: objectId })
    } catch (error) {
      // If not a valid ObjectId, try to find by string ID
      insight = await collection.findOne({ _id: insightId })
    }

    await client.close()

    if (!insight) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404 })
    }

    return NextResponse.json(insight)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch insight" }, { status: 500 })
  }
}
