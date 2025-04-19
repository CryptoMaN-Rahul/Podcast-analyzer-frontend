"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Bookmark, Share2, Download, BarChart2, Zap, Sparkles } from "lucide-react"

export function PremiumFeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const features = [
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: "Advanced Search",
      description: "Find exactly what you're looking for with our powerful search capabilities.",
    },
    {
      icon: <Filter className="h-10 w-10 text-blue-500" />,
      title: "Smart Filtering",
      description: "Filter ideas by category, channel, tags, and more to narrow down your options.",
    },
    {
      icon: <Bookmark className="h-10 w-10 text-yellow-500" />,
      title: "Save Favorites",
      description: "Bookmark your favorite ideas to revisit them later for inspiration.",
    },
    {
      icon: <Share2 className="h-10 w-10 text-green-500" />,
      title: "Easy Sharing",
      description: "Share interesting business ideas with your team or network.",
    },
    {
      icon: <Download className="h-10 w-10 text-purple-500" />,
      title: "Export Options",
      description: "Export insights as PDF or CSV for offline reference and analysis.",
    },
    {
      icon: <BarChart2 className="h-10 w-10 text-orange-500" />,
      title: "Visual Analytics",
      description: "Visualize trends and patterns across different business categories.",
    },
  ]

  return (
    <div ref={ref} className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything You Need to Discover Ideas</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools you need to find, analyze, and implement business ideas from top
            podcasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 card-highlight">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="rounded-full bg-muted p-3 w-fit mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="inline-block"
          >
            <Card className="border-0 shadow-md bg-gradient-to-r from-primary/80 to-purple-600/80 text-white">
              <CardContent className="p-8 flex items-center gap-4">
                <div className="rounded-full bg-white/20 p-3">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-1">Upgrade to Pro</h3>
                  <p className="text-white/80">Get access to all features and premium insights</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
