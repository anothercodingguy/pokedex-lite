import type { PokemonDetail } from '../types/pokemon'

export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  speed: 'Speed',
}

export function formatPokemonName(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function getPokemonArtwork(pokemon: PokemonDetail): string | null {
  return (
    pokemon.sprites.other?.['official-artwork']?.front_default ??
    pokemon.sprites.front_default ??
    null
  )
}

export function getStatValue(pokemon: PokemonDetail, statName: string): number {
  return (
    pokemon.stats.find((stat) => stat.stat.name === statName)?.base_stat ?? 0
  )
}

export function formatHeight(decimeters: number): string {
  return `${(decimeters / 10).toFixed(1)} m`
}

export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`
}
