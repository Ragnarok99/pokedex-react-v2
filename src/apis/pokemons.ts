import {
  GetPokemonType,
  Pokemon,
  PokemonEvolutionChain,
  PokemonSpecie,
  SinglePokemon,
} from "../types";

import { pokeClient } from "./pokeClient";

// TODO: ALL of these interfaces should be shared and extended
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
  offset?: number;
  search?: string;
}

interface GetPaginatedPokemonsResponse {
  results: SinglePokemon[];
  next: string | null;
  count?: number;
  previous: string | null;
}

export const getPaginatedPokemons = async ({
  offset = 0,
  search,
}: GetPaginatedPokemonsArgs = {}) => {
  const itemsPerPage = 30;

  const response = await pokeClient.get<GetPaginatedPokemonsResponse>(
    "/pokemon",
    {
      params: {
        limit: itemsPerPage,
        offset,
      },
    }
  );

  if (search) {
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
