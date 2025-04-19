import { Suspense } from "react"
import { FavoritesGrid } from "./favorites-grid"
import { InsightCardSkeletonGrid } from "@/components/skeleton-loader"
import { Heart } from "lucide-react"

export default function FavoritesPage() {
  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <div className="flex flex-col items-start gap-4 md:gap-6 mb-8">
        <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
          <Heart className="h-4 w-4" />
          Your Saved Ideas
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
          <p className="text-muted-foreground">Your saved business ideas and insights for future reference.</p>
        </div>
      </div>

      <Suspense fallback={<InsightCardSkeletonGrid count={6} />}>
        <FavoritesGrid />
      </Suspense>
    </div>
  )
}
