import type { PokemonDetail } from '../types/pokemon'
import { PokemonCard } from './PokemonCard'

type PokemonGridProps = {
  pokemon: PokemonDetail[]
  isFavorite: (pokemonId: number) => boolean
  onSelectPokemon: (pokemon: PokemonDetail) => void
  onToggleFavorite: (pokemonId: number) => void
}

export function PokemonGrid({
  pokemon,
  isFavorite,
  onSelectPokemon,
  onToggleFavorite,
}: PokemonGridProps) {
  return (
    <div className="pokemon-grid">
      {pokemon.map((pokemonDetail) => (
        <PokemonCard
          key={pokemonDetail.id}
          pokemon={pokemonDetail}
          isFavorite={isFavorite(pokemonDetail.id)}
          onSelect={onSelectPokemon}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
