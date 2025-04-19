"use client"

import { useEffect, useState } from "react"
import { useQueries } from "@tanstack/react-query"
import { InsightCard } from "@/components/insight-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { useFavorites } from "@/lib/favorites"
import { getInsight } from "@/lib/api"
import type { Insight } from "@/lib/types"

export function FavoritesGrid() {
  const { favorites, isLoaded } = useFavorites()
  const [isClient, setIsClient] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  const favoriteQueries = useQueries({
    queries: favorites.map((id) => ({
      queryKey: ["insight", id],
      queryFn: () => getInsight(id),
      enabled: isLoaded && isClient,
    })),
  })

  const isLoading = favoriteQueries.some((query) => query.isLoading) || !isClient
  const isError = favoriteQueries.some((query) => query.isError)

  const insights = favoriteQueries.filter((query) => query.data).map((query) => query.data as Insight)

  if (!isClient) {
    return <LoadingSpinner className="py-12" />
  }

  if (isLoading) {
    return <LoadingSpinner className="py-12" />
  }

  if (isError) {
    return (
      <ErrorMessage title="Failed to load favorites" message="There was an error loading your favorite insights." />
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
        <p className="text-muted-foreground">Add insights to your favorites by clicking the heart icon.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {insights.map((insight) => (
        <InsightCard key={insight._id} insight={insight} />
      ))}
    </div>
  )
}
