"use client"

import { useCallback, useEffect, useState } from "react"

const FAVORITES_KEY = "podcast-insights-favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY)
      setFavorites(storedFavorites ? JSON.parse(storedFavorites) : [])
    } catch (error) {
      console.error("Failed to load favorites:", error)
      setFavorites([])
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  const addFavorite = useCallback((insightId: string) => {
    setFavorites((prev) => [...prev, insightId])
  }, [])

  const removeFavorite = useCallback((insightId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== insightId))
  }, [])

  const toggleFavorite = useCallback((insightId: string) => {
    setFavorites((prev) => (prev.includes(insightId) ? prev.filter((id) => id !== insightId) : [...prev, insightId]))
  }, [])

  const isFavorite = useCallback((insightId: string) => favorites.includes(insightId), [favorites])

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    isLoaded,
  }
}
