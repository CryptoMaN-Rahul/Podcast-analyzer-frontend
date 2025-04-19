"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { FilterControls } from "@/components/filter-controls"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { EnhancedSearchBar } from "@/components/enhanced-search-bar"
import { useState } from "react"

export function PremiumFilterSection() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="space-y-4" ref={containerRef}>
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <EnhancedSearchBar autoFocus={false} />
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="hidden md:block flex-1">
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            transition={{ duration: 0.3 }}
          >
            <Accordion type="single" collapsible defaultValue="filters">
              <AccordionItem value="filters" className="border-none">
                <AccordionTrigger className="py-2">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <FilterControls orientation="horizontal" />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <FilterControls orientation="vertical" onFilterChange={() => setIsOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
