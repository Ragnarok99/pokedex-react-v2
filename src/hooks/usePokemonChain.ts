import React from "react";
import { useQuery } from "@tanstack/react-query";

import { getPokemonChain } from "../apis";
import { POKEMON_KEYS } from "../queryKeys";
import { Chain } from "../types";

export interface PokemonChain {
  imageURL: string;
  name: string;
  minLevel: number;
}
interface UsePokemonEvolutionChainProps {
  name?: string;
  id?: string | number;
}

interface GetEvolutionChainArgs {
  nextEvolution: Chain[];
  evolutionArray: PokemonChain[];
}

function getEvolutionChain({
  nextEvolution,
  evolutionArray,
}: GetEvolutionChainArgs) {
  evolutionArray.push({
    name: nextEvolution[0]?.species.name,
    imageURL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
      nextEvolution[0]?.species.url.split("/")[6]
    }.png`,
    minLevel: nextEvolution[0]?.evolution_details[0]?.min_level,
  });

  if (!nextEvolution[0] || nextEvolution[0].evolves_to?.length === 0) {
    return;
  }

  getEvolutionChain({
    nextEvolution: nextEvolution[0]?.evolves_to,
    evolutionArray,
  });
}

export const usePokemonChain = ({
  id,
  name,
}: UsePokemonEvolutionChainProps) => {
  const { data, isLoading } = useQuery(
    [POKEMON_KEYS.POKEMON_CHAIN, name],
    () => getPokemonChain({ id }),
    { enabled: Boolean(id) }
  );

  const evolutionArray = [
    {
      name: data?.chain.species.name,
      imageURL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
        data?.chain.species.url.split("/")[6]
      }.png`,
      minLevel: 0,
    },
  ] as PokemonChain[];

  data &&
    getEvolutionChain({
      nextEvolution: data?.chain.evolves_to,
      evolutionArray,
    });

  return { pokemonChain: id ? evolutionArray : null, isLoading };
};
