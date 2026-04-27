import { RotateCcw } from 'lucide-react'
import type { NamedApiResource } from '../types/pokemon'
import { formatPokemonName } from '../utils/pokemon'

type TypeFiltersProps = {
  types: NamedApiResource[]
  selectedTypes: string[]
  isLoading: boolean
  onToggleType: (typeName: string) => void
  onClearTypes: () => void
}

export function TypeFilters({
  types,
  selectedTypes,
  isLoading,
  onToggleType,
  onClearTypes,
}: TypeFiltersProps) {
  return (
    <section className="type-filter-panel" aria-label="Type filters">
      <div className="filter-panel-header">
        <span>Types</span>
        <button
          type="button"
          className="text-button"
          disabled={selectedTypes.length === 0}
          onClick={onClearTypes}
        >
          <RotateCcw size={15} aria-hidden="true" />
          Reset
        </button>
      </div>

      <div className="type-filter-list">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <span
                className="type-filter-skeleton"
                key={`type-skeleton-${index}`}
              />
            ))
          : types.map((type) => {
              const isSelected = selectedTypes.includes(type.name)

              return (
                <button
                  type="button"
                  key={type.name}
                  className={`type-pill type-${type.name} ${
                    isSelected ? 'is-selected' : ''
                  }`}
                  aria-pressed={isSelected}
                  onClick={() => onToggleType(type.name)}
                >
                  {formatPokemonName(type.name)}
                </button>
              )
            })}
      </div>
    </section>
  )
}
