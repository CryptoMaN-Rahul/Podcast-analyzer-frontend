import type { PodcastStack } from "@/lib/types"

// Scoring weights for different fields
const WEIGHTS = {
  TITLE: 10,
  EPISODE_TITLE: 8,
  PODCAST_NAME: 6,
  PROBLEM: 5,
  DESCRIPTION: 3,
  CATEGORY: 4,
  TAGS: 7,
}

// Interface for search result with score
export interface SearchResult<T> {
  item: T
  score: number
  matches: {
    field: string
    text: string
    score: number
  }[]
}

// Function to normalize text for search
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()
}

// Function to calculate Levenshtein distance for fuzzy matching
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

// Function to calculate similarity score between two strings (0-1)
export function calculateSimilarity(source: string, target: string): number {
  if (!source || !target) return 0

  const sourceNorm = normalizeText(source)
  const targetNorm = normalizeText(target)

  // Exact match
  if (sourceNorm === targetNorm) return 1

  // Contains match
  if (sourceNorm.includes(targetNorm)) return 0.9
  if (targetNorm.includes(sourceNorm)) return 0.8

  // Word match
  const sourceWords = sourceNorm.split(" ")
  const targetWords = targetNorm.split(" ")

  const wordMatches = sourceWords.filter((word) =>
    targetWords.some((targetWord) => targetWord === word || targetWord.includes(word) || word.includes(targetWord)),
  ).length

  if (wordMatches > 0) {
    return 0.7 * (wordMatches / Math.max(sourceWords.length, targetWords.length))
  }

  // Fuzzy match
  const maxLength = Math.max(sourceNorm.length, targetNorm.length)
  if (maxLength === 0) return 0

  const distance = levenshteinDistance(sourceNorm, targetNorm)
  const similarity = 1 - distance / maxLength

  return similarity > 0.6 ? similarity * 0.6 : 0 // Only count if reasonably similar
}

// Search function for podcast stacks
export function searchPodcastStacks(stacks: PodcastStack[], query: string): SearchResult<PodcastStack>[] {
  if (!query || query.trim() === "") return stacks.map((stack) => ({ item: stack, score: 1, matches: [] }))

  const normalizedQuery = normalizeText(query)
  const results: SearchResult<PodcastStack>[] = []

  for (const stack of stacks) {
    const matches: { field: string; text: string; score: number }[] = []
    let totalScore = 0

    // Check episode title
    const episodeTitleScore = calculateSimilarity(stack.episodeTitle, normalizedQuery) * WEIGHTS.EPISODE_TITLE
    if (episodeTitleScore > 0) {
      matches.push({ field: "episodeTitle", text: stack.episodeTitle, score: episodeTitleScore })
      totalScore += episodeTitleScore
    }

    // Check podcast name
    const podcastNameScore = calculateSimilarity(stack.podcastName, normalizedQuery) * WEIGHTS.PODCAST_NAME
    if (podcastNameScore > 0) {
      matches.push({ field: "podcastName", text: stack.podcastName, score: podcastNameScore })
      totalScore += podcastNameScore
    }

    // Check categories
    for (const category of stack.categories) {
      const categoryScore = calculateSimilarity(category, normalizedQuery) * WEIGHTS.CATEGORY
      if (categoryScore > 0) {
        matches.push({ field: "category", text: category, score: categoryScore })
        totalScore += categoryScore
        break // Only count the best category match
      }
    }

    // Check tags
    for (const tag of stack.tags) {
      const tagScore = calculateSimilarity(tag, normalizedQuery) * WEIGHTS.TAGS
      if (tagScore > 0) {
        matches.push({ field: "tag", text: tag, score: tagScore })
        totalScore += tagScore
        break // Only count the best tag match
      }
    }

    // Check insights within the stack
    let bestInsightScore = 0
    let bestInsightMatch = null

    for (const insight of stack.insights) {
      // Check insight title
      const titleScore = calculateSimilarity(insight.title, normalizedQuery) * WEIGHTS.TITLE
      if (titleScore > bestInsightScore) {
        bestInsightScore = titleScore
        bestInsightMatch = { field: "insightTitle", text: insight.title, score: titleScore }
      }

      // Check problem addressed
      const problemScore = calculateSimilarity(insight.problem_addressed, normalizedQuery) * WEIGHTS.PROBLEM
      if (problemScore > bestInsightScore) {
        bestInsightScore = problemScore
        bestInsightMatch = { field: "problem", text: insight.problem_addressed, score: problemScore }
      }

      // Check description (lower weight as it's longer)
      const descriptionScore = calculateSimilarity(insight.description, normalizedQuery) * WEIGHTS.DESCRIPTION
      if (descriptionScore > bestInsightScore) {
        bestInsightScore = descriptionScore
        bestInsightMatch = { field: "description", text: insight.description, score: descriptionScore }
      }
    }

    if (bestInsightMatch) {
      matches.push(bestInsightMatch)
      totalScore += bestInsightScore
    }

    // Only include results with a meaningful score
    if (totalScore > 0) {
      results.push({
        item: stack,
        score: totalScore,
        matches,
      })
    }
  }

  // Sort by score (descending)
  return results.sort((a, b) => b.score - a.score)
}

// Function to extract search suggestions from content
export function generateSearchSuggestions(query: string, stacks: PodcastStack[], maxSuggestions = 5): string[] {
  if (!query || query.trim() === "") return []

  const normalizedQuery = normalizeText(query)
  const suggestions = new Set<string>()

  // Helper to add a suggestion if it starts with the query
  const addSuggestion = (text: string) => {
    if (!text) return

    const normalizedText = normalizeText(text)

    // Exact match - don't suggest the same thing
    if (normalizedText === normalizedQuery) return

    // Starts with match
    if (normalizedText.startsWith(normalizedQuery)) {
      // Limit suggestion length
      const suggestion = text.length > 50 ? text.substring(0, 50) + "..." : text
      suggestions.add(suggestion)
      return
    }

    // Word match (for multi-word queries)
    const queryWords = normalizedQuery.split(" ")
    if (queryWords.length > 1) {
      const lastWord = queryWords[queryWords.length - 1]
      const textWords = normalizedText.split(" ")

      for (const word of textWords) {
        if (word.startsWith(lastWord) && word !== lastWord) {
          // Replace the last word in the query with the matching word
          const newQuery = [...queryWords.slice(0, queryWords.length - 1), word].join(" ")
          suggestions.add(newQuery)
        }
      }
    }
  }

  // Extract suggestions from stacks
  for (const stack of stacks) {
    if (suggestions.size >= maxSuggestions) break

    addSuggestion(stack.episodeTitle)
    addSuggestion(stack.podcastName)

    for (const category of stack.categories) {
      if (suggestions.size >= maxSuggestions) break
      addSuggestion(category)
    }

    for (const tag of stack.tags) {
      if (suggestions.size >= maxSuggestions) break
      addSuggestion(tag)
    }

    for (const insight of stack.insights) {
      if (suggestions.size >= maxSuggestions) break
      addSuggestion(insight.title)
    }
  }

  return Array.from(suggestions).slice(0, maxSuggestions)
}

// Function to highlight matching text in search results
export function highlightMatches(text: string, query: string): string {
  if (!query || !text) return text

  const normalizedText = text.toLowerCase()
  const normalizedQuery = normalizeText(query)

  if (!normalizedText.includes(normalizedQuery)) return text

  const index = normalizedText.indexOf(normalizedQuery)
  const prefix = text.substring(0, index)
  const match = text.substring(index, index + normalizedQuery.length)
  const suffix = text.substring(index + normalizedQuery.length)

  return `${prefix}<mark class="bg-primary/20 text-foreground px-0.5 rounded">${match}</mark>${suffix}`
}

// Cache for search results
interface CacheEntry<T> {
  timestamp: number
  results: SearchResult<T>[]
}

class SearchCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map()
  private readonly TTL: number // Time to live in milliseconds

  constructor(ttlMinutes = 60) {
    this.TTL = ttlMinutes * 60 * 1000
  }

  get(key: string): SearchResult<T>[] | null {
    const entry = this.cache.get(key)

    if (!entry) return null

    // Check if entry is expired
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key)
      return null
    }

    return entry.results
  }

  set(key: string, results: SearchResult<T>[]): void {
    this.cache.set(key, {
      timestamp: Date.now(),
      results,
    })

    // Cleanup old entries if cache gets too large
    if (this.cache.size > 100) {
      const oldestKey = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0]
      this.cache.delete(oldestKey)
    }
  }

  clear(): void {
    this.cache.clear()
  }
}

// Export cache instance
export const podcastStackSearchCache = new SearchCache<PodcastStack>(60) // 60 minutes TTL
