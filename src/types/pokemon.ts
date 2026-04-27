export type NamedApiResource = {
  name: string
  url: string
}

export type ResourceList<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type PokemonListItem = NamedApiResource & {
  id: number
}

export type PokemonSprites = {
  front_default: string | null
  other?: {
    'official-artwork'?: {
      front_default: string | null
    }
  }
}

export type PokemonTypeSlot = {
  slot: number
  type: NamedApiResource
}

export type PokemonAbilitySlot = {
  ability: NamedApiResource
  is_hidden: boolean
  slot: number
}

export type PokemonStat = {
  base_stat: number
  effort: number
  stat: NamedApiResource
}

export type PokemonDetail = {
  id: number
  name: string
  height: number
  weight: number
  sprites: PokemonSprites
  types: PokemonTypeSlot[]
  abilities: PokemonAbilitySlot[]
  stats: PokemonStat[]
}

export type TypePokemonEntry = {
  slot: number
  pokemon: NamedApiResource
}

export type PokemonTypeDetail = {
  id: number
  name: string
  pokemon: TypePokemonEntry[]
}
