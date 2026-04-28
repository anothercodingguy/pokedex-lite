import { Heart, Ruler, Scale, X } from 'lucide-react'
import { useEffect, type MouseEvent } from 'react'
import { useCountUp } from '../hooks/useCountUp'
import type { PokemonDetail } from '../types/pokemon'
import {
  formatPokemonName,
  getPokemonArtwork,
  getStatValue,
  STAT_LABELS,
} from '../utils/pokemon'

type PokemonModalProps = {
  pokemon: PokemonDetail
  isFavorite: boolean
  onClose: () => void
  onToggleFavorite: (pokemonId: number) => void
}

const DETAIL_STATS = ['hp', 'attack', 'defense', 'speed']
const MAX_STAT_VALUE = 180

type MetricCounterProps = {
  decimals?: number
  targetValue: number
  unit: string
}

function MetricCounter({
  decimals = 1,
  targetValue,
  unit,
}: MetricCounterProps) {
  const displayValue = useCountUp(targetValue, {
    decimals,
    duration: 720,
  })

  return (
    <>
      {displayValue.toFixed(decimals)} {unit}
    </>
  )
}

type StatRowProps = {
  label: string
  value: number
}

function StatRow({ label, value }: StatRowProps) {
  const displayValue = useCountUp(value, {
    duration: 760,
  })
  const width = Math.min(100, (value / MAX_STAT_VALUE) * 100)

  return (
    <div className="stat-row">
      <span>{label}</span>
      <div className="stat-track">
        <span className="stat-fill" style={{ width: `${width}%` }} />
      </div>
      <strong>{Math.round(displayValue)}</strong>
    </div>
  )
}

export function PokemonModal({
  pokemon,
  isFavorite,
  onClose,
  onToggleFavorite,
}: PokemonModalProps) {
  const pokemonName = formatPokemonName(pokemon.name)
  const artworkUrl = getPokemonArtwork(pokemon)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={handleBackdropMouseDown}
    >
      <section
        className="pokemon-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pokemon-modal-title"
      >
        <button
          type="button"
          className="modal-close-button"
          aria-label="Close detail view"
          onClick={onClose}
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="modal-visual-panel">
          <span className="pokemon-number">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          {artworkUrl ? (
            <img src={artworkUrl} alt={pokemonName} className="modal-artwork" />
          ) : (
            <span className="modal-artwork-placeholder" aria-hidden="true">
              {pokemonName.charAt(0)}
            </span>
          )}
        </div>

        <div className="modal-content-panel">
          <div className="modal-title-row">
            <div>
              <h2 id="pokemon-modal-title">{pokemonName}</h2>
              <div className="type-badge-row">
                {pokemon.types.map((pokemonType) => (
                  <span
                    className={`type-pill type-${pokemonType.type.name}`}
                    key={`modal-${pokemon.id}-${pokemonType.type.name}`}
                  >
                    {formatPokemonName(pokemonType.type.name)}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="favorite-button modal-favorite-button"
              aria-label={
                isFavorite
                  ? `Remove ${pokemonName} from favorites`
                  : `Add ${pokemonName} to favorites`
              }
              aria-pressed={isFavorite}
              onClick={() => onToggleFavorite(pokemon.id)}
            >
              <Heart
                size={20}
                aria-hidden="true"
                fill={isFavorite ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          <div className="detail-metrics">
            <span className="metric-card">
              <Ruler size={17} aria-hidden="true" />
              <MetricCounter targetValue={pokemon.height / 10} unit="m" />
            </span>
            <span className="metric-card">
              <Scale size={17} aria-hidden="true" />
              <MetricCounter targetValue={pokemon.weight / 10} unit="kg" />
            </span>
          </div>

          <section className="detail-section" aria-labelledby="stats-title">
            <h3 id="stats-title">Base stats</h3>
            <div className="stat-list">
              {DETAIL_STATS.map((statName) => {
                const value = getStatValue(pokemon, statName)
                return (
                  <StatRow
                    key={`${pokemon.id}-${statName}`}
                    label={STAT_LABELS[statName]}
                    value={value}
                  />
                )
              })}
            </div>
          </section>

          <section className="detail-section" aria-labelledby="abilities-title">
            <h3 id="abilities-title">Abilities</h3>
            <div className="ability-list">
              {pokemon.abilities.map((ability) => (
                <span key={`${pokemon.id}-${ability.ability.name}`}>
                  {formatPokemonName(ability.ability.name)}
                  {ability.is_hidden ? ' hidden' : ''}
                </span>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
