"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    quote:
      "This platform has completely transformed how I find business ideas. The insights extracted from podcasts are pure gold!",
    author: "Sarah Johnson",
    role: "Startup Founder",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SJ",
  },
  {
    quote:
      "I've launched two successful businesses based on ideas I discovered through this platform. It's an entrepreneur's dream tool.",
    author: "Michael Chen",
    role: "Serial Entrepreneur",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MC",
  },
  {
    quote:
      "The ability to filter ideas by category and save favorites has streamlined my research process. Highly recommended!",
    author: "Jessica Williams",
    role: "Product Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JW",
  },
  {
    quote:
      "As an investor, I use this platform to spot emerging trends and business opportunities. It's become an essential part of my workflow.",
    author: "David Rodriguez",
    role: "Angel Investor",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "DR",
  },
]

export function PremiumTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextTestimonial = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextTestimonial()
    }, 8000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      nextTestimonial()
    }, 8000)
  }

  const handleNext = () => {
    nextTestimonial()
    resetInterval()
  }

  const handlePrev = () => {
    prevTestimonial()
    resetInterval()
  }

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
    resetInterval()
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  }

  return (
    <div className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from entrepreneurs and business professionals who have found success with our platform.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -top-8 left-0 opacity-30">
            <Quote className="h-16 w-16 text-primary" />
          </div>

          <div className="min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <Card className="border-0 shadow-md bg-background">
                  <CardContent className="p-8 md:p-12">
                    <blockquote className="text-xl md:text-2xl font-medium text-center mb-8">
                      "{testimonials[currentIndex].quote}"
                    </blockquote>
                    <div className="flex flex-col items-center">
                      <Avatar className="h-16 w-16 mb-4">
                        <AvatarImage src={testimonials[currentIndex].avatar} alt={testimonials[currentIndex].author} />
                        <AvatarFallback>{testimonials[currentIndex].initials}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <div className="font-semibold">{testimonials[currentIndex].author}</div>
                        <div className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30",
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 md:-ml-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-background shadow-md"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 md:-mr-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 bg-background shadow-md"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
