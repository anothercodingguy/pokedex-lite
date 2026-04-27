import { useCallback, useEffect, useState } from 'react'

const FAVORITES_STORAGE_KEY = 'pokedex-lite:favorites'

function readStoredFavorites(): Set<number> {
  if (typeof window === 'undefined') {
    return new Set()
  }

  try {
    const storedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!storedValue) {
      return new Set()
    }

    const parsedValue: unknown = JSON.parse(storedValue)
    if (!Array.isArray(parsedValue)) {
      return new Set()
    }

    return new Set(
      parsedValue.filter(
        (value): value is number =>
          typeof value === 'number' && Number.isInteger(value),
      ),
    )
  } catch {
    return new Set()
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(
    readStoredFavorites,
  )

  useEffect(() => {
    const favoriteList = Array.from(favoriteIds).sort(
      (left, right) => left - right,
    )
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favoriteList),
    )
  }, [favoriteIds])

  const toggleFavorite = useCallback((pokemonId: number) => {
    setFavoriteIds((currentFavorites) => {
      const nextFavorites = new Set(currentFavorites)

      if (nextFavorites.has(pokemonId)) {
        nextFavorites.delete(pokemonId)
      } else {
        nextFavorites.add(pokemonId)
      }

      return nextFavorites
    })
  }, [])

  const isFavorite = useCallback(
    (pokemonId: number) => favoriteIds.has(pokemonId),
    [favoriteIds],
  )

  return {
    favoriteCount: favoriteIds.size,
    favoriteIds,
    isFavorite,
    toggleFavorite,
  }
}
