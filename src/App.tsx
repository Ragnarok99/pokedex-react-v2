import React from "react";
import { useQueries, useQuery } from "react-query";

import { getPaginatedPokemons, getPokemonDetails } from "./apis";
import { POKEMON_KEYS } from "./queryKeys";
import { Card } from "./components";

const App = () => {
  const imagesRef = React.useRef<any[]>([]);

  const pokeListQuery = useQuery([POKEMON_KEYS.POKEMON_LIST], () =>
    getPaginatedPokemons()
  );

  const pokeQueries =
    pokeListQuery.data?.results.map((pokemon) => ({
      queryKey: [POKEMON_KEYS.POKEMON, pokemon.name],
      queryFn: () => getPokemonDetails({ id: pokemon.url.split("/")[6] }),
    })) ?? [];

  const pokemonDetails = useQueries(pokeQueries);

  const isLoading = pokemonDetails.some((result) => result.isLoading);

  return (
    <section className="bg-custom-gray-50 min-h-screen">
      <div className="p-4 max-w-7xl m-auto">
        <div className="grid grid-cols-4 gap-x-6 gap-y-16 row-g mt-10">
          {isLoading || pokeListQuery.isLoading ? (
            <>loading...</>
          ) : (
            pokemonDetails.map(({ data }, index) => (
              <Card key={data?.id}>
                <div className="flex items-center h-full pt-8 justify-center flex-col">
                  <div
                    className={`absolute flex items-start -top-12 h-[105px]`}
                  >
                    <img
                      ref={imagesRef?.current[index]}
                      className="m-auto"
                      src={
                        data?.sprites.versions?.["generation-v"]["black-white"]
                          .animated?.front_default
                      }
                      alt={`${data?.name} picture`}
                    />
                  </div>
                  <div className="text-center">
                    <span className="blck text-xs text-gray-500 font-bold">
                      N°{data?.id}
                    </span>
                    <span className="block text-lg font-bold capitalize">
                      {data?.name}
                    </span>
                    <ul className="flex gap-2 justify-center">
                      {data?.types.map((type) => (
                        <li
                          className={`font-semibold px-2 py-1 rounded-lg text-gray-800 text-xs uppercase ${type.type.name}`}
                          key={type.type.name}
                        >
                          {type.type.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default App;
