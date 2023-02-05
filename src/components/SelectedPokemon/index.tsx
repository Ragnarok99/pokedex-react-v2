import { useQuery } from "react-query";
import { getPokemonDetails, getPokemonSpecie } from "../../apis";
import { STATS, STAT_COLORS } from "../../constants";

import { POKEMON_KEYS } from "../../queryKeys";
import { Pokemon } from "../../types";

type Props = {
  selectedPokemon?: Pokemon;
};

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

  if (!selectedPokemon) return null;

  if (pokemonQuery.isLoading || pokeSpecie.isLoading) {
    return <aside>loading...</aside>;
  }

  return (
    <aside className="bg-white rounded-2xl px-7 mt-20 flex flex-col items-center col-span-4">
      <div className="-mt-24">
        <img
          className="h-64"
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonQuery.data?.id}.png`}
          alt={pokemonQuery?.data?.name}
        />
      </div>
      <div className="text-center grid gap-1">
        <span className="blck text-sm text-gray-400 font-extrabold">
          #{pokemonQuery.data?.id}
        </span>
        <span className="block text-2xl text-gray-800 font-bold capitalize">
          {pokemonQuery.data?.name}
        </span>
        <p className="text-sm text-gray-400">
          {pokeSpecie.data?.genera[7].genus}
        </p>
        <ul className="flex pt-1 gap-2 justify-center">
          {pokemonQuery.data?.types.map((type) => (
            <li
              className={`font-semibold px-3 py-1 rounded-lg text-white text-[11px] uppercase ${type.type.name}`}
              key={type.type.name}
            >
              <span>{type.type.name}</span>
            </li>
          ))}
        </ul>
        <h3 className="font-extrabold py-2 text-gray-800 text-sm tracking-widest">
          POKÉDEX ENTRY
        </h3>
        <p className="font-lato text-base">
          {pokeSpecie.data?.flavor_text_entries[7].flavor_text}
        </p>
        <h4 className="font-extrabold pt-4 text-gray-800 text-sm tracking-widest">
          ABILITIES
        </h4>
        <ul className="flex pt-1 pb-2 items-center justify-center gap-2">
          {pokemonQuery.data?.abilities.map((ability) => (
            <li
              className="bg-custom-gray-50 border text-sm font-semibold text-gray-700 capitalize border-gray-300 py-1.5 w-full text-left pl-6 pr-4 rounded-full"
              key={ability.ability.name}
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
              {/* {pokeSpecie.data?.} */}
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
        <div>
          <h4 className="font-extrabold pt-4 text-gray-800 text-sm tracking-widest">
            EVOLUTION
          </h4>
        </div>
      </div>
    </aside>
  );
};
