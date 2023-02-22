import React from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";

import useMediaQuery from "./hooks/useMediaQuery";

import { getPaginatedPokemons, getPokemonDetails } from "./apis";
import { Card, SelectedPokemon } from "./components";
import { POKEMON_TYPE_COLORS } from "./constants";
import { POKEMON_KEYS } from "./queryKeys";
import { Pokemon } from "./types";
import { Dropdown } from "./components/Dropdown";

const type = ["Type ", "Kenton ", "Therese ", "Benedict ", "Katelyn "];
const weaknesses = [
  "Weaknesses",
  "Kenton ",
  "Therese ",
  "Benedict ",
  "Katelyn ",
];
const ability = ["Ability", "Kenton ", "Therese ", "Benedict ", "Katelyn "];
const height = ["Height", "Kenton ", "Therese ", "Benedict ", "Katelyn "];
const weight = ["Weight", "Kenton ", "Therese ", "Benedict ", "Katelyn "];

const App = () => {
  const { ref, inView } = useInView();

  const imagesRef = React.useRef<any[]>([]);
  const [search, setSearch] = React.useState("");
  const [selectedPokemon, setSelectedPokemon] = React.useState<Pokemon>();
  const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);
  const [selectedtype, setSelectedtype] = React.useState(type[0]);
  const [selectedweaknesses, setSelectedweaknesses] = React.useState(
    weaknesses[0]
  );
  const [selectedability, setSelectedability] = React.useState(ability[0]);
  const [selectedheight, setSelectedheight] = React.useState(height[0]);
  const [selectedweight, setSelectedweight] = React.useState(weight[0]);

  const isDesktop = useMediaQuery("(min-width:1024px)");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearch(searchValue);
  };

  const pokeListQuery = useInfiniteQuery(
    [POKEMON_KEYS.POKEMON_LIST, { search }],
    ({ pageParam }) => {
      return getPaginatedPokemons({ offset: pageParam, search });
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) return false;
        const urlParams = new URLSearchParams(
          lastPage.next?.split("pokemon")[1]
        );

        return Number(urlParams.get("offset"));
      },
    }
  );

  const detailQueries =
    pokeListQuery.data?.pages
      ?.map(({ results }) =>
        results.map((pokemon) => ({
          queryKey: [POKEMON_KEYS.POKEMON, pokemon.name],
          queryFn: () => getPokemonDetails({ id: pokemon.url.split("/")[6] }),
          enabled: Boolean(pokeListQuery?.data?.pages),
        }))
      )
      .flat() ?? [];

  const pokemonDetails = useQueries({ queries: detailQueries });

  const isLoadingPokemonDetails = pokemonDetails.some(
    (result) => result.isLoading
  );
  const isIdlePokemonDetails = pokemonDetails.some(
    (result) => result.fetchStatus === "idle"
  );

  React.useEffect(() => {
    if (inView) {
      pokeListQuery.fetchNextPage();
    }
  }, [inView]);

  return (
    <section className="bg-custom-gray-50 min-h-screen">
      <div className="p-4 max-w-7xl m-auto">
        <header className="grid grid-cols-12 gap-6">
          <div className="grid gap-10 col-span-12 lg:col-span-8">
            <div className="bg-white flex justify-between px-5 py-4 rounded-xl">
              <input
                value={search}
                onChange={handleSearch}
                className="outline-none w-full placeholder-gray-400 placeholder:tracking-wide placeholder:font-light placeholder:text-base"
                placeholder="Search your Pokémon!"
              />
              <div className="bg-primary h-10 w-10 rounded-xl flex items-center justify-center">
                <div className="pokeball pokeball__semi" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                <span className="text-sm font-semibold text-gray-800">
                  Ascending
                </span>
                <ChevronDownIcon className="w-6 h-6" />
              </div>
            </div>

            <div className="hidden lg:flex gap-3 items-center">
              <Dropdown
                value={selectedtype}
                onChange={setSelectedtype}
                options={type}
              />
              <Dropdown
                value={selectedweaknesses}
                onChange={setSelectedweaknesses}
                options={weaknesses}
              />
              <Dropdown
                value={selectedability}
                onChange={setSelectedability}
                options={ability}
              />
              <Dropdown
                value={selectedheight}
                onChange={setSelectedheight}
                options={height}
              />
              <Dropdown
                value={selectedweight}
                onChange={setSelectedweight}
                options={weight}
              />

              <button className="min-w-[40px] h-10 p-3 bg-slate-400 rounded-xl">
                <ArrowPathIcon className="text-white" />
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-12">
          <div className="col-span-12 lg:col-span-8 grid w-full grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-16 mt-20">
            {pokemonDetails.map(({ data }, index) => (
              <Card
                onClick={() => {
                  setSelectedPokemon(data);
                  setDialogVisible(true);
                }}
                key={index}
              >
                <div className="flex items-center h-full pt-8 justify-center flex-col">
                  <div
                    className={`absolute flex items-start -top-12 h-[105px]`}
                  >
                    <img
                      ref={imagesRef?.current[index]}
                      className="m-auto"
                      loading="lazy"
                      src={
                        data?.sprites.versions?.["generation-v"]["black-white"]
                          .animated?.front_default ??
                        data?.sprites.versions?.["generation-v"]["black-white"]
                          .front_default ??
                        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data?.id}.png`
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
            ))}
          </div>
          <div className="hidden lg:block md:col-span-4 top-24 sticky h-fit -mt-40">
            <SelectedPokemon selectedPokemon={selectedPokemon} />
          </div>
          <div
            ref={ref}
            className={`${
              !pokeListQuery.hasNextPage ||
              (isLoadingPokemonDetails &&
                isIdlePokemonDetails &&
                Boolean(search))
                ? "hidden"
                : ""
            }`}
          >
            {pokeListQuery.isFetchingNextPage ? "Loading more..." : ""}
          </div>
          {pokeListQuery.isLoading && <div>loading ...</div>}

          {!pokeListQuery.hasNextPage &&
            !pokeListQuery.isLoading &&
            !Boolean(search) && <div>wow... those're all pokemon!!</div>}
        </div>
      </div>
      {!isDesktop && (
        <Transition.Root show={dialogVisible} as={React.Fragment}>
          <Dialog
            as="div"
            className="relative z-20 lg:hidden"
            onClose={() => {}}
          >
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
      )}
    </section>
  );
};

export default App;
