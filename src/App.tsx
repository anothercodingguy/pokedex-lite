import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import {
  fetchPokemonBatch,
  fetchPokemonIndex,
  fetchPokemonNamesByTypes,
  fetchPokemonTypes,
} from './api/pokeApi'
import './App.css'
import { EmptyState } from './components/EmptyState'
import { ErrorPanel } from './components/ErrorPanel'
import { Pagination } from './components/Pagination'
import { PokemonGrid } from './components/PokemonGrid'
import { PokemonModal } from './components/PokemonModal'
import { SearchBar } from './components/SearchBar'
import { SkeletonGrid } from './components/SkeletonGrid'
import { TypeFilters } from './components/TypeFilters'
import { useFavorites } from './hooks/useFavorites'
import type { PokemonDetail } from './types/pokemon'

const PAGE_SIZE = 24

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(
    null,
  )
  const { favoriteCount, isFavorite, toggleFavorite } = useFavorites()

  const pokemonIndexQuery = useQuery({
    queryKey: ['pokemon-index'],
    queryFn: fetchPokemonIndex,
  })

  const typeListQuery = useQuery({
    queryKey: ['pokemon-types'],
    queryFn: fetchPokemonTypes,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const selectedTypesKey = useMemo(
    () => [...selectedTypes].sort().join('|'),
    [selectedTypes],
  )

  const typeMembershipQuery = useQuery({
    queryKey: ['pokemon-type-memberships', selectedTypesKey],
    queryFn: () => fetchPokemonNamesByTypes(selectedTypes),
    enabled: selectedTypes.length > 0,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const matchingTypeNames = useMemo(
    () => new Set(typeMembershipQuery.data ?? []),
    [typeMembershipQuery.data],
  )

  const filteredPokemon = useMemo(() => {
    const pokemonIndex = pokemonIndexQuery.data ?? []
    const normalizedSearch = searchQuery.trim().toLowerCase()
    const hasTypeFilter = selectedTypesKey.length > 0

    return pokemonIndex.filter((pokemon) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        pokemon.name.toLowerCase().includes(normalizedSearch)
      const matchesType = !hasTypeFilter || matchingTypeNames.has(pokemon.name)

      return matchesSearch && matchesType
    })
  }, [matchingTypeNames, pokemonIndexQuery.data, searchQuery, selectedTypesKey])

  const pageCount = Math.max(1, Math.ceil(filteredPokemon.length / PAGE_SIZE))
  const activePage = Math.min(currentPage, pageCount)
  const pageStartIndex = (activePage - 1) * PAGE_SIZE
  const visiblePokemon = filteredPokemon.slice(
    pageStartIndex,
    pageStartIndex + PAGE_SIZE,
  )
  const visiblePokemonKey = visiblePokemon.map((pokemon) => pokemon.name).join('|')

  const isTypeFiltering =
    selectedTypes.length > 0 && typeMembershipQuery.isLoading

  const pagePokemonQuery = useQuery({
    queryKey: ['pokemon-page', visiblePokemonKey],
    queryFn: () => fetchPokemonBatch(visiblePokemon),
    enabled:
      visiblePokemon.length > 0 &&
      pokemonIndexQuery.isSuccess &&
      !isTypeFiltering,
  })

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setCurrentPage(1)
  }

  const toggleType = (typeName: string) => {
    setCurrentPage(1)
    setSelectedTypes((currentTypes) =>
      currentTypes.includes(typeName)
        ? currentTypes.filter((selectedType) => selectedType !== typeName)
        : [...currentTypes, typeName],
    )
  }

  const clearTypes = () => {
    setSelectedTypes([])
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTypes([])
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), pageCount))
  }

  const retryQueries = () => {
    void pokemonIndexQuery.refetch()
    void typeListQuery.refetch()
    void typeMembershipQuery.refetch()
    void pagePokemonQuery.refetch()
  }

  const listError =
    pokemonIndexQuery.error ??
    typeListQuery.error ??
    typeMembershipQuery.error ??
    pagePokemonQuery.error
  const isPageLoading =
    pokemonIndexQuery.isLoading || isTypeFiltering || pagePokemonQuery.isLoading
  const shouldShowEmpty =
    !isPageLoading && !listError && filteredPokemon.length === 0
  const pokemonOnPage = pagePokemonQuery.data ?? []

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-block">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <p className="eyebrow">PokeAPI explorer</p>
            <h1>Pokedex Lite</h1>
          </div>
        </div>

        <div className="favorite-summary" aria-label="Saved favorites">
          <Heart size={18} aria-hidden="true" fill="currentColor" />
          <span>{favoriteCount}</span>
        </div>
      </header>

      <section className="toolbar" aria-label="Search and filter controls">
        <SearchBar
          value={searchQuery}
          resultCount={filteredPokemon.length}
          isLoading={pokemonIndexQuery.isLoading || isTypeFiltering}
          onChange={handleSearchChange}
          onClear={clearSearch}
        />

        <TypeFilters
          types={typeListQuery.data ?? []}
          selectedTypes={selectedTypes}
          isLoading={typeListQuery.isLoading}
          onToggleType={toggleType}
          onClearTypes={clearTypes}
        />
      </section>

      <section className="list-section" aria-label="Pokemon list">
        {listError ? (
          <ErrorPanel
            message={
              listError instanceof Error
                ? listError.message
                : 'An unexpected network problem occurred.'
            }
            onRetry={retryQueries}
          />
        ) : shouldShowEmpty ? (
          <EmptyState onClearFilters={clearFilters} />
        ) : isPageLoading ? (
          <SkeletonGrid count={12} />
        ) : (
          <PokemonGrid
            pokemon={pokemonOnPage}
            isFavorite={isFavorite}
            onSelectPokemon={setSelectedPokemon}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </section>

      <Pagination
        currentPage={activePage}
        pageCount={pageCount}
        pageSize={PAGE_SIZE}
        totalItems={filteredPokemon.length}
        onPageChange={handlePageChange}
      />

      {selectedPokemon ? (
        <PokemonModal
          pokemon={selectedPokemon}
          isFavorite={isFavorite(selectedPokemon.id)}
          onClose={() => setSelectedPokemon(null)}
          onToggleFavorite={toggleFavorite}
        />
      ) : null}
    </main>
  )
}

export default App
