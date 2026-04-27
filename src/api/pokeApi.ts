import type {
  NamedApiResource,
  PokemonDetail,
  PokemonListItem,
  PokemonTypeDetail,
  ResourceList,
} from '../types/pokemon'

const API_BASE_URL = 'https://pokeapi.co/api/v2'

const CORE_TYPE_ORDER = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`PokeAPI request failed with ${response.status}`)
  }

  return response.json() as Promise<T>
}

function getResourceId(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  return match ? Number(match[1]) : 0
}

export async function fetchPokemonIndex(): Promise<PokemonListItem[]> {
  const firstPage = await fetchJson<ResourceList<NamedApiResource>>(
    '/pokemon?limit=1&offset=0',
  )

  const completeList = await fetchJson<ResourceList<NamedApiResource>>(
    `/pokemon?limit=${firstPage.count}&offset=0`,
  )

  return completeList.results.map((pokemon) => ({
    ...pokemon,
    id: getResourceId(pokemon.url),
  }))
}

export async function fetchPokemonTypes(): Promise<NamedApiResource[]> {
  const typeList = await fetchJson<ResourceList<NamedApiResource>>('/type')
  const typeRank = new Map(CORE_TYPE_ORDER.map((name, index) => [name, index]))

  return typeList.results
    .filter((type) => typeRank.has(type.name))
    .sort((left, right) => typeRank.get(left.name)! - typeRank.get(right.name)!)
}

export async function fetchPokemonByName(name: string): Promise<PokemonDetail> {
  return fetchJson<PokemonDetail>(
    `/pokemon/${encodeURIComponent(name.toLowerCase())}`,
  )
}

export async function fetchPokemonBatch(
  pokemon: PokemonListItem[],
): Promise<PokemonDetail[]> {
  return Promise.all(pokemon.map((item) => fetchPokemonByName(item.name)))
}

export async function fetchPokemonNamesByTypes(
  types: string[],
): Promise<string[]> {
  if (types.length === 0) {
    return []
  }

  const typeDetails = await Promise.all(
    types.map((type) =>
      fetchJson<PokemonTypeDetail>(`/type/${encodeURIComponent(type)}`),
    ),
  )
  const matchingNames = new Set<string>()

  typeDetails.forEach((typeDetail) => {
    typeDetail.pokemon.forEach((entry) => {
      matchingNames.add(entry.pokemon.name)
    })
  })

  return Array.from(matchingNames)
}
