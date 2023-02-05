import React from "react";
import { useQuery } from "react-query";

import { getPokemonChain } from "../apis";
import { POKEMON_KEYS } from "../queryKeys";
import { Chain } from "../types";

export interface PokemonChain {
  imageURL: string;
  name: string;
  nextPokemon?: any;
  minLevel: number;
}

interface UsePokemonEvolutionChainProps {
  name: string;
  id: string | number;
}

export const usePokemonChain = ({
  id,
  name,
}: UsePokemonEvolutionChainProps) => {
  const [chain, setChain] = React.useState<any[]>();
  const [loading, setLoading] = React.useState<boolean>(true);

  const { data } = useQuery(
    [POKEMON_KEYS.POKEMON_CHAIN, name],
    () => getPokemonChain({ id }),
    { enabled: Boolean(id) }
  );

  const pokemonChainArray = [
    {
      name: data?.chain.species.name,
      imageURL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      minLevel: 0,
    },
  ];

  getEvolutionChain(data?.chain.evolves_to, pokemonChainArray);

  setChain(pokemonChainArray);
  setLoading(false);

  return { pokemonChain: chain, loading };
};

function getEvolutionChain(pokemonChainArray: any[], nextChain?: Chain) {
  const [
    {
      species: { name, url },
      evolution_details,
      evolves_to,
    },
  ] = nextChain;

  const nextPokemonInfo = {
    name,
    imageURL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
      url.split("/")[url.split("/").length - 2]
    }.png`,
    minLevel: evolution_details[0].min_level,
  };

  if (!pokemonChainArray[pokemonChainArray.length - 1].nextPokemon) {
    pokemonChainArray[pokemonChainArray.length - 1].nextPokemon =
      nextPokemonInfo;
    if (evolves_to.length > 0) {
      pokemonChainArray.push(nextPokemonInfo);
    }
  }

  if (evolves_to.length > 0) getEvolutionChain(evolves_to, pokemonChainArray);
  else {
    return;
  }
}
