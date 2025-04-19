"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaginationProps {
  total: number
  limit: number
  offset: number
}

export function Pagination({ total, limit, offset }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const totalPages = Math.ceil(total / limit)
  const currentPage = Math.floor(offset / limit) + 1

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    const newOffset = (page - 1) * limit

    if (newOffset > 0) {
      params.set("offset", newOffset.toString())
    } else {
      params.delete("offset")
    }

    router.push(`?${params.toString()}`)
  }

  const changeLimit = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("limit", newLimit)
    params.delete("offset") // Reset to first page
    router.push(`?${params.toString()}`)
  }

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{offset + 1}</span> to{" "}
        <span className="font-medium">{Math.min(offset + limit, total)}</span> of{" "}
        <span className="font-medium">{total}</span> results
      </div>

      <div className="flex items-center gap-4">
        <Select value={limit.toString()} onValueChange={changeLimit}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="12 per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">6 per page</SelectItem>
            <SelectItem value="12">12 per page</SelectItem>
            <SelectItem value="24">24 per page</SelectItem>
            <SelectItem value="48">48 per page</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="hidden sm:flex"
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number

              if (totalPages <= 5) {
                // If 5 or fewer pages, show all
                pageNum = i + 1
              } else if (currentPage <= 3) {
                // If near the start, show first 5 pages
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                // If near the end, show last 5 pages
                pageNum = totalPages - 4 + i
              } else {
                // Otherwise show 2 before and 2 after current page
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className="w-9 h-9 hidden sm:flex"
                >
                  {pageNum}
                </Button>
              )
            })}
            <div className="sm:hidden text-sm font-medium px-2">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="hidden sm:flex"
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
