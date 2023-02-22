import React from "react";
import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  getPokemonDetails,
  getPokemonSpecie,
  getPokemonType,
} from "../../apis";

import { GetPokemonType, Pokemon } from "../../types";
import {
  POKEMON_TYPE_COLORS,
  POKEMON_TYPE_IMAGES,
  STATS,
  STAT_COLORS,
} from "../../constants";
import { usePokemonChain } from "../../hooks";

import { POKEMON_KEYS } from "../../queryKeys";

type Props = {
  selectedPokemon?: Pokemon;
};

function getPokemonWeaknessesFromTypes(
  pokemonTypesQuery: UseQueryResult<GetPokemonType, unknown>[]
) {
  const isLoading = pokemonTypesQuery.some((result) => result.isLoading);

  if (isLoading) return { isLoading, data: null };

  const types = pokemonTypesQuery.map((type) => {
    const dblDmgFrom =
      type.data?.damage_relations.double_damage_from.map(
        (dblDmgType) => dblDmgType.name
      ) || [];
    const halfDmgFrom =
      type.data?.damage_relations.half_damage_from.map(
        (halfDmgType) => halfDmgType.name
      ) || [];

    return [...dblDmgFrom, ...halfDmgFrom];
  });

  const pokemonWeaknesses = Array.from(new Set(types.flat())).map((type) => ({
    name: type,
    color: POKEMON_TYPE_IMAGES[type as keyof typeof POKEMON_TYPE_IMAGES],
  }));

  return { data: pokemonWeaknesses, isLoading };
}

export const SelectedPokemon = ({ selectedPokemon }: Props) => {
  const pokemonQuery = useQuery(
    [POKEMON_KEYS.POKEMON, selectedPokemon?.name],
    () => getPokemonDetails({ id: selectedPokemon?.id }),
    { enabled: Boolean(selectedPokemon?.id) }
  );

  const pokeSpecie = useQuery(
    [POKEMON_KEYS.SPECIE, selectedPokemon?.name],
    () => getPokemonSpecie({ id: selectedPokemon?.id }),
    { enabled: Boolean(selectedPokemon?.id) }
  );

  const pokeChain = usePokemonChain({
    name: selectedPokemon?.name,
    id: pokeSpecie.data?.evolution_chain.url.split("/")[6],
  });

  const queriesTest =
    pokemonQuery.data?.types.map((type) => ({
      queryKey: [POKEMON_KEYS.TYPE, type.type.name],
      queryFn: () => getPokemonType({ id: type.type.url.split("/")[6] }),
    })) ?? [];

  const pokeTypes = useQueries({ queries: queriesTest });

  const weaknesses = getPokemonWeaknessesFromTypes(pokeTypes);

  if (!selectedPokemon) return null;

  if (pokemonQuery.isLoading || pokeSpecie.isLoading || pokeChain.isLoading) {
    return <aside>loading...</aside>;
  }

  return (
    <aside className="h-fit mt-20 pb-4 lg:mt-0 bg-white rounded-2xl px-4 flex flex-col items-center">
      <div className="-mt-24">
        <img
          loading="lazy"
          className="h-64"
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonQuery.data?.id}.png`}
          alt={pokemonQuery?.data?.name}
        />
      </div>
      <div className="text-center grid gap-1">
        <span className="blck text-base text-gray-400 font-extrabold">
          #{pokemonQuery.data?.id}
        </span>
        <span className="block text-2xl text-gray-800 font-bold capitalize">
          {pokemonQuery.data?.name}
        </span>
        <p className="text-sm text-gray-400">
          {pokeSpecie.data?.genera[7]?.genus}
        </p>
        <ul className="flex pt-1 gap-2 justify-center">
          {pokemonQuery.data?.types.map((type) => (
            <li
              style={{
                backgroundColor:
                  POKEMON_TYPE_COLORS[
                    type.type.name as keyof typeof POKEMON_TYPE_COLORS
                  ],
              }}
              className={`font-semibold px-3 py-1 rounded-lg text-white text-[11px] uppercase`}
              key={type.type.name}
            >
              <span>{type.type.name}</span>
            </li>
          ))}
        </ul>
        <h3 className="font-extrabold py-2 text-gray-800 text-sm tracking-widest">
          POKÉDEX ENTRY
        </h3>
        <div className="grid gap-2">
          {pokeSpecie.data?.flavor_text_entries
            ?.filter((flavorText) => flavorText.language.name === "en")
            .reduce((prev: string[], flavorText) => {
              const test = new Set([
                ...prev,
                flavorText.flavor_text
                  .toLowerCase()
                  .replaceAll("\n", " ")
                  .replaceAll("\f", " ")
                  .replaceAll("&shy; ", ""),
              ]);
              return Array.from(test);
            }, [])
            .splice(0, 3)
            .map((flavorText, idx) => (
              <p
                key={idx}
                className="font-lato prose text-slate-800 text-base first-letter:capitalize"
              >
                <>{flavorText}</>
              </p>
            ))}
        </div>
        <h4 className="font-extrabold pt-4 text-gray-800 text-sm tracking-widest">
          ABILITIES
        </h4>
        <ul className="flex pt-1 pb-2  items-center justify-center gap-2">
          {pokemonQuery.data?.abilities.map((ability, idx) => (
            <li
              className="bg-custom-gray-50 w-fit text-center border text-sm font-semibold text-gray-700 capitalize border-gray-300 py-1.5 lg:text-left px-4 rounded-full"
              key={idx}
            >
              {ability.ability.name.replace("-", " ")}
            </li>
          ))}
        </ul>
        {/* height weight */}
        <div className="grid grid-cols-2 gap-2">
          <div className="grid">
            <h4 className="font-extrabold py-2 text-gray-800 text-sm tracking-widest">
              HEIGHT
            </h4>

            <div className="bg-custom-gray-50 text-center text-sm font-semibold text-gray-700 py-1.5 w-full pl-6 pr-4 rounded-full">
              {(Number(pokemonQuery.data?.height) * 10) / 100}m
            </div>
          </div>
          <div>
            <h4 className="font-extrabold py-2 text-gray-800 text-sm tracking-widest">
              WEIGHT
            </h4>

            <div className="bg-custom-gray-50 text-center text-sm font-semibold text-gray-700 capitalize py-1.5 w-full pl-6 pr-4 rounded-full">
              {Number(pokemonQuery.data?.weight) / 10}kg
            </div>
          </div>
        </div>
        {/* weakess base xp */}
        <div className="grid grid-cols-2 gap-2">
          <div className="grid">
            <h4 className="font-extrabold py-2 text-gray-800 text-sm tracking-widest">
              WEAKNESSES
            </h4>

            <div className="bg-custom-gray-50 text-center text-sm font-semibold text-gray-700 py-1.5 w-full pl-6 pr-4 rounded-full">
              <ul className="flex gap-1 justify-center">
                <li className="rounded-full bg-gray-500 text-white text-[10px] font-semibold w-6 h-6 flex items-center justify-center">
                  {Number(weaknesses.data?.length) - 3}x
                </li>
                {weaknesses.data
                  ?.slice(weaknesses?.data.length - 3, weaknesses?.data.length)
                  ?.map((weakness) => (
                    <li
                      key={weakness.name}
                      className="rounded-full text-white text-[10px] font-semibold w-6 h-6 flex items-center justify-center"
                    >
                      <img
                        loading="lazy"
                        src={weakness.color}
                        alt={weakness.name}
                      />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-extrabold py-2 text-gray-800 text-sm tracking-widest">
              BASE EXP
            </h4>

            <div className="bg-custom-gray-50 text-center text-sm font-semibold text-gray-700 capitalize py-1.5 w-full pl-6 pr-4 rounded-full">
              {pokemonQuery.data?.base_experience}
            </div>
          </div>
        </div>
        {/* STATS */}
        <div className="grid gap-3">
          <h4 className="font-extrabold pt-4 text-gray-800 text-sm tracking-widest">
            STATS
          </h4>
          <ul className="flex justify-between gap-2 w-full">
            {pokemonQuery.data?.stats.map((stat) => (
              <li
                key={stat.stat.name}
                className="grid gap-1 bg-custom-gray-100 rounded-3xl pb-2"
              >
                <div
                  style={{
                    backgroundColor:
                      STAT_COLORS[stat.stat.name as keyof typeof STAT_COLORS],
                  }}
                  className="rounded-full text-white text-[10px] font-semibold w-8 h-8 flex items-center justify-center"
                >
                  <span>{STATS[stat.stat.name as keyof typeof STATS]}</span>
                </div>
                <span className="font-extrabold text-xs">{stat.base_stat}</span>
              </li>
            ))}
            <li className="grid gap-1 bg-[#91acf9] rounded-3xl pb-2">
              <div className="rounded-full text-white bg-[#7994db] text-[10px] font-semibold w-8 h-8 flex items-center justify-center">
                <span>TOT</span>
              </div>
              <span className="font-extrabold text-xs">
                {pokemonQuery.data?.stats.reduce(
                  (prev, current) => prev + Number(current.base_stat),
                  0
                )}
              </span>
            </li>
          </ul>
        </div>
        <div className="grid gap-4">
          <h4 className="font-extrabold pt-4 text-gray-800 text-sm tracking-widest">
            EVOLUTION
          </h4>
          <div className="flex justify-between items-center gap-2">
            {pokeChain.pokemonChain?.map((pokemonEvolution) => (
              <React.Fragment key={pokemonEvolution.name}>
                {pokemonEvolution.trigger && (
                  <span className="bg-custom-gray-50 text-center text-[11px] font-semibold text-gray-400 py-1.5 w-full px-2 rounded-full">
                    {pokemonEvolution.trigger}
                  </span>
                )}
                <img
                  loading="lazy"
                  className="w-auto h-16"
                  src={pokemonEvolution?.imageURL}
                  alt={`${pokemonEvolution.name} picture`}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
