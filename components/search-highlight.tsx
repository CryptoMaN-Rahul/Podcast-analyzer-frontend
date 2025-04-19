"use client"

import { useSearch } from "@/contexts/search-context"
import { highlightMatches } from "@/lib/search-utils"

interface SearchHighlightProps {
  text: string
  className?: string
}

export function SearchHighlight({ text, className }: SearchHighlightProps) {
  const { searchQuery } = useSearch()

  if (!searchQuery || !text) {
    return <span className={className}>{text}</span>
  }

  const highlightedText = highlightMatches(text, searchQuery)

  return <span className={className} dangerouslySetInnerHTML={{ __html: highlightedText }} />
}
