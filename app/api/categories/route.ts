import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { normalizeCategory } from "@/lib/category-utils"

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

    // Get distinct categories
    const rawCategories = await collection.distinct("category")

    // Filter out null or empty categories
    const validCategories = rawCategories.filter((category) => category && category.trim() !== "")

    // Normalize categories and count occurrences
    const categoryMap = new Map<string, number>()

    validCategories.forEach((category) => {
      const normalized = normalizeCategory(category)
      categoryMap.set(normalized, (categoryMap.get(normalized) || 0) + 1)
    })

    // Convert to array and sort by count (most common first)
    const normalizedCategories = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category)

    await client.close()

    return NextResponse.json(normalizedCategories)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
