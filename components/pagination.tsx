"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

interface PaginationProps {
  total: number
  limit: number
  offset: number
  isLoading?: boolean
}

export function Pagination({ total, limit, offset, isLoading = false }: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)

  const hasPrevious = offset > 0
  const hasNext = offset + limit < total

  const getPageHref = (page: number) => {
    const newOffset = (page - 1) * limit
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set("offset", newOffset.toString())
    return `?${searchParams.toString()}`
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{offset + 1}</span> to{" "}
        <span className="font-medium">{Math.min(offset + limit, total)}</span> of{" "}
        <span className="font-medium">{total}</span> results
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevious || isLoading}
          onClick={() => window.history.pushState(null, "", getPageHref(currentPage - 1))}
        >
          {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <ChevronLeft className="h-4 w-4 mr-1" />}
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext || isLoading}
          onClick={() => window.history.pushState(null, "", getPageHref(currentPage + 1))}
        >
          Next
          {isLoading ? <Loader2 className="h-4 w-4 ml-1 animate-spin" /> : <ChevronRight className="h-4 w-4 ml-1" />}
        </Button>
      </div>
    </div>
  )
}
