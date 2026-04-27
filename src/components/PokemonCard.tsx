import { Heart } from 'lucide-react'
import type { PokemonDetail } from '../types/pokemon'
import { formatPokemonName, getPokemonArtwork } from '../utils/pokemon'

type PokemonCardProps = {
  pokemon: PokemonDetail
  isFavorite: boolean
  onSelect: (pokemon: PokemonDetail) => void
  onToggleFavorite: (pokemonId: number) => void
}

export function PokemonCard({
  pokemon,
  isFavorite,
  onSelect,
  onToggleFavorite,
}: PokemonCardProps) {
  const pokemonName = formatPokemonName(pokemon.name)
  const artworkUrl = getPokemonArtwork(pokemon)

  return (
    <article className="pokemon-card">
      <button
        type="button"
        className="favorite-button"
        aria-label={
          isFavorite
            ? `Remove ${pokemonName} from favorites`
            : `Add ${pokemonName} to favorites`
        }
        aria-pressed={isFavorite}
        onClick={() => onToggleFavorite(pokemon.id)}
      >
        <Heart
          size={19}
          aria-hidden="true"
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </button>

      <button
        type="button"
        className="pokemon-card-main"
        onClick={() => onSelect(pokemon)}
      >
        <span className="pokemon-number">
          #{String(pokemon.id).padStart(3, '0')}
        </span>

        <span className="pokemon-artwork-wrap">
          {artworkUrl ? (
            <img
              src={artworkUrl}
              alt={pokemonName}
              className="pokemon-artwork"
              loading="lazy"
            />
          ) : (
            <span className="pokemon-artwork-placeholder" aria-hidden="true">
              {pokemonName.charAt(0)}
            </span>
          )}
        </span>

        <span className="pokemon-card-name">{pokemonName}</span>

        <span className="type-badge-row">
          {pokemon.types.map((pokemonType) => (
            <span
              className={`type-pill type-${pokemonType.type.name}`}
              key={`${pokemon.id}-${pokemonType.type.name}`}
            >
              {formatPokemonName(pokemonType.type.name)}
            </span>
          ))}
        </span>
      </button>
    </article>
  )
}
