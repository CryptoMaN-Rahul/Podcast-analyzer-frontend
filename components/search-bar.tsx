"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""

  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    if (debouncedSearchTerm === initialSearch) return

    const params = new URLSearchParams(searchParams.toString())

    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm)
    } else {
      params.delete("search")
    }

    // Reset to first page when search changes
    params.delete("offset")

    router.push(`?${params.toString()}`)
  }, [debouncedSearchTerm, router, searchParams, initialSearch])

  const clearSearch = () => {
    setSearchTerm("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("search")
    params.delete("offset")
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for business ideas, problems, or solutions..."
        className="pl-10 pr-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}
