import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden hero-gradient py-10 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              <Sparkles className="mr-1 h-4 w-4 inline-block" />
              Discover Business Ideas from Top Podcasts
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-balance">
              Turn Podcast Insights into <span className="text-primary">Business Opportunities</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Explore business ideas and insights extracted from popular YouTube podcasts. Find your next big
              opportunity.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-1">
              <Link href="#insights">
                Explore Insights
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/analytics">View Analytics</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </div>
  )
}
