import {
  Pokemon,
  PokemonEvolutionChain,
  PokemonSpecie,
  SinglePokemon,
} from "../types";

import { pokeClient } from "./pokeClient";

interface GetPokemonDetailsArgs {
  id?: string | number;
}

interface GetPokemonSpecieArgs {
  id?: string | number;
}

interface GetPokemonChainArgs {
  id?: string | number;
}

interface GetPaginatedPokemonsArgs {
  limit?: number;
  offset?: number;
}

interface GetPaginatedPokemosResponse {
  results: SinglePokemon[];
  count?: number;
  next: string | null;
  previous: string | null;
}

export const getPaginatedPokemons = async ({
  limit = 10,
  offset = 0,
}: GetPaginatedPokemonsArgs = {}) => {
  const response = await pokeClient.get<GetPaginatedPokemosResponse>(
    "/pokemon",
    {
      params: { limit, offset },
    }
  );

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
