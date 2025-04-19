"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Zap } from "lucide-react"
import Link from "next/link"

export function PremiumCtaSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const features = [
    "Unlimited access to all business ideas",
    "Advanced filtering and search capabilities",
    "Export insights in multiple formats",
    "Priority access to new features",
    "Personalized recommendations",
    "No advertisements",
  ]

  return (
    <div ref={ref} className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              <span>Upgrade Today</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Take Your Business Ideas to the Next Level
            </h2>
            <p className="text-muted-foreground text-lg">
              Unlock premium features and get unlimited access to all business insights with our Pro plan.
            </p>

            <ul className="space-y-3">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="rounded-full bg-primary/10 p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="gap-2">
                <Zap className="h-4 w-4 text-yellow-300" />
                Upgrade to Pro
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#">Learn More</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg overflow-hidden animated-border">
              <CardContent className="p-0">
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-6 space-y-4">
                    <div className="text-xl font-semibold">Free</div>
                    <div className="text-3xl font-bold">
                      $0<span className="text-lg font-normal text-muted-foreground">/mo</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Limited access to insights</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Basic search functionality</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Save up to 5 favorites</span>
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full">
                      Current Plan
                    </Button>
                  </div>
                  <div className="p-6 space-y-4 bg-primary/5 relative">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1">
                      POPULAR
                    </div>
                    <div className="text-xl font-semibold">Pro</div>
                    <div className="text-3xl font-bold">
                      $19<span className="text-lg font-normal text-muted-foreground">/mo</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Unlimited access to all insights</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Advanced search & filtering</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Unlimited favorites</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Export in multiple formats</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Priority support</span>
                      </li>
                    </ul>
                    <Button className="w-full">Upgrade Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
