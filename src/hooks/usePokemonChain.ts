import React from "react";
import { useQuery } from "@tanstack/react-query";

import { getPokemonChain } from "../apis";
import { POKEMON_KEYS } from "../queryKeys";
import { Chain, EvolutionDetail } from "../types";

export interface PokemonChain {
  imageURL: string;
  name: string;
  trigger?: string;
}
interface UsePokemonEvolutionChainProps {
  name?: string;
  id?: string | number;
}

interface GetEvolutionChainArgs {
  nextEvolution: Chain[];
  evolutionArray: PokemonChain[];
}

function getEvolutionTrigger(evolutionDetail?: EvolutionDetail) {
  if (!evolutionDetail) return;
  if (evolutionDetail.min_level) {
    return `Lvl ${evolutionDetail.min_level}`;
  }

  if (evolutionDetail.min_happiness) {
    return `Happiness ${evolutionDetail.min_happiness}`;
  }

  if (evolutionDetail.item) {
    return `${evolutionDetail.item.name}`;
  }

  return undefined;
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
    trigger: getEvolutionTrigger(nextEvolution[0]?.evolution_details[0]),
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
    },
  ] as PokemonChain[];

  data &&
    getEvolutionChain({
      nextEvolution: data?.chain.evolves_to,
      evolutionArray,
    });

  return {
    pokemonChain: id
      ? evolutionArray.filter((evolution) => evolution.name)
      : null,
    isLoading,
  };
};
