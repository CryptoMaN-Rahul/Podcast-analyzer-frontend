"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles, Play, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function AdvancedHero() {
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden py-20 md:py-32 mesh-background"
      onMouseMove={handleMouseMove}
      style={
        {
          "--x": `${mousePosition.x}px`,
          "--y": `${mousePosition.y}px`,
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(var(--primary-rgb),0.15),transparent_25%)]"></div>
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-4 w-4" />
              <span>Discover Business Ideas from Top Podcasts</span>
            </motion.div>

            <div className="relative">
              <motion.h1
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none lg:text-7xl/none text-balance max-w-3xl mx-auto"
                custom={1}
                variants={textVariants}
              >
                Turn Podcast Insights into{" "}
                <span className="relative inline-block">
                  <span className="text-gradient">Business Opportunities</span>
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </span>
              </motion.h1>
            </div>

            <motion.p
              className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
              custom={2}
              variants={textVariants}
            >
              Explore business ideas and insights extracted from popular YouTube podcasts. Find your next big
              opportunity with our AI-powered platform.
            </motion.p>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              asChild
              size="lg"
              className="gap-1 group relative overflow-hidden"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Link href="#podcast-stacks">
                Explore Insights
                <ArrowRight
                  className={cn("h-4 w-4 transition-transform duration-300", hovered ? "translate-x-1" : "")}
                />
                <span className="absolute inset-0 z-0 spotlight" />
              </Link>
            </Button>

            <Button variant="outline" size="lg" className="gap-2 group" asChild>
              <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">
                <Play className="h-4 w-4 transition-transform duration-300 group-hover:scale-125" />
                <span>Watch Demo</span>
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="pt-8 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground">Featured podcasts from</p>
            <div className="flex flex-wrap justify-center gap-8 grayscale opacity-70">
              {["Lex Fridman", "Tim Ferriss", "Joe Rogan", "Andrew Huberman", "Naval Ravikant"].map((company, i) => (
                <motion.div
                  key={company}
                  className="text-sm font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 1.2,
            duration: 0.5,
            y: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 1.5,
              ease: "easeInOut",
            },
          }}
        >
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border" asChild>
            <a href="#podcast-stacks">
              <ChevronRight className="h-4 w-4 rotate-90" />
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
