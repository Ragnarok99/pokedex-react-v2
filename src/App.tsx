import React from "react";
import { useQueries, useQuery } from "react-query";
import { XMarkIcon } from "@heroicons/react/20/solid";

import { getPaginatedPokemons, getPokemonDetails } from "./apis";
import { POKEMON_KEYS } from "./queryKeys";
import { Card, SelectedPokemon } from "./components";
import { Pokemon } from "./types";
import { POKEMON_TYPE_COLORS } from "./constants";
import { Dialog, Transition } from "@headlessui/react";

const App = () => {
  const imagesRef = React.useRef<any[]>([]);
  const [selectedPokemon, setSelectedPokemon] = React.useState<Pokemon>();
  const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);

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
        <div className="grid grid-container gap-6 md:grid-cols-12">
          <div className="col-span-12 lg:col-span-8 grid w-full grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-16 mt-10">
            {isLoading || pokeListQuery.isLoading ? (
              <>loading...</>
            ) : (
              pokemonDetails.map(({ data }, index) => (
                <Card
                  onClick={() => {
                    setSelectedPokemon(data);
                    setDialogVisible(true);
                  }}
                  key={data?.id}
                >
                  <div className="flex items-center h-full pt-8 justify-center flex-col">
                    <div
                      className={`absolute flex items-start -top-12 h-[105px]`}
                    >
                      <img
                        ref={imagesRef?.current[index]}
                        className="m-auto"
                        src={
                          data?.sprites.versions?.["generation-v"][
                            "black-white"
                          ].animated?.front_default
                        }
                        alt={`${data?.name} picture`}
                      />
                    </div>
                    <div className="text-center grid gap-1">
                      <span className="blck text-xs text-gray-400 mt-3 font-extrabold">
                        N°{data?.id}
                      </span>
                      <span className="mt-2 block text-lg text-gray-800 font-bold capitalize">
                        {data?.name}
                      </span>
                      <ul className="flex gap-2 justify-center">
                        {data?.types.map((type) => (
                          <li
                            style={{
                              backgroundColor:
                                POKEMON_TYPE_COLORS[
                                  type.type
                                    .name as keyof typeof POKEMON_TYPE_COLORS
                                ],
                            }}
                            className={`font-semibold px-3 py-1 rounded-lg text-white text-[11px] uppercase`}
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
          <div className="hidden lg:block md:col-span-4 top-24 sticky h-fit mt-20">
            <SelectedPokemon selectedPokemon={selectedPokemon} />
          </div>
        </div>
      </div>
      <Transition.Root show={dialogVisible} as={React.Fragment}>
        <Dialog as="div" className="relative z-20 lg:hidden" onClose={() => {}}>
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-20 flex">
            <Transition.Child
              as={React.Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-lg flex-1 flex-col bg-white">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 m-3 border-gray-300 p-2 border items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setDialogVisible(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                  <SelectedPokemon selectedPokemon={selectedPokemon} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </section>
  );
};

export default App;
