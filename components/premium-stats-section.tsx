"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import CountUp from "react-countup"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, Users, Podcast, Zap } from "lucide-react"

export function PremiumStatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  const stats = [
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
      value: 1250,
      label: "Business Ideas",
      suffix: "+",
    },
    {
      icon: <Podcast className="h-8 w-8 text-purple-500" />,
      value: 14,
      label: "Podcast Channels",
      suffix: "",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      value: 5000,
      label: "Active Users",
      suffix: "+",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      value: 98,
      label: "Success Rate",
      suffix: "%",
    },
  ]

  return (
    <div ref={ref} className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-background p-3 mb-4">{stat.icon}</div>
                  <div className="text-3xl font-bold mb-1">
                    {hasAnimated ? (
                      <CountUp end={stat.value} duration={2.5} separator="," suffix={stat.suffix} />
                    ) : (
                      <span>0{stat.suffix}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
