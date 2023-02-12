import { TOTAL_POKEMON_COUNT } from "../constants";
import {
  GetPokemonType,
  Pokemon,
  PokemonEvolutionChain,
  PokemonSpecie,
  SinglePokemon,
} from "../types";

import { pokeClient } from "./pokeClient";

// TODO: ALL of these interfaces should be shared and extensible
interface GetPokemonDetailsArgs {
  id?: string | number;
}

interface GetPokemonSpecieArgs {
  id?: string | number;
}

interface GetPokemonChainArgs {
  id?: string | number;
}

interface GetPokemonTypeArgs {
  id?: string | number;
}

interface GetPaginatedPokemonsArgs {
  limit?: number;
  search?: string;
  offset?: number;
}

interface GetPaginatedPokemonsResponse {
  results: SinglePokemon[];
  count?: number;
  next: string | null;
  previous: string | null;
}

export const getPaginatedPokemons = async ({
  limit = 100,
  offset = 0,
  search,
}: GetPaginatedPokemonsArgs = {}) => {
  const response = await pokeClient.get<GetPaginatedPokemonsResponse>(
    "/pokemon",
    {
      params: { limit, offset },
    }
  );

  if (search && limit === TOTAL_POKEMON_COUNT) {
    const results = response.data.results.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );
    return {
      ...response.data,
      results,
    };
  }

  return response.data;
};

export const getPokemonDetails = async ({ id }: GetPokemonDetailsArgs) => {
  const response = await pokeClient.get<Pokemon>(`/pokemon/${id}`);

  return response.data;
};

export const getPokemonSpecie = async ({ id }: GetPokemonSpecieArgs) => {
  const response = await pokeClient.get<PokemonSpecie>(
    `/pokemon-species/${id}`
  );

  return response.data;
};

export const getPokemonChain = async ({ id }: GetPokemonChainArgs) => {
  const response = await pokeClient.get<PokemonEvolutionChain>(
    `/evolution-chain/${id}`
  );

  return response.data;
};

export const getPokemonType = async ({ id }: GetPokemonTypeArgs) => {
  const response = await pokeClient.get<GetPokemonType>(`/type/${id}`);

  return response.data;
};
