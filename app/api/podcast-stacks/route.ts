import { type NextRequest, NextResponse } from "next/server"
import { getPodcastStacks } from "@/lib/podcast-stack-utils"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const channelId = searchParams.get("channelId") || undefined
  const category = searchParams.get("category") || undefined
  const tags = searchParams.get("tags") || undefined
  const search = searchParams.get("search") || undefined
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 9
  const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : 0
  const sort = searchParams.get("sort") || "newest"

  try {
    const result = await getPodcastStacks({
      channelId,
      category,
      tags,
      search,
      limit,
      offset,
      sort,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching podcast stacks:", error)
    return NextResponse.json({ error: "Failed to fetch podcast stacks" }, { status: 500 })
  }
}
