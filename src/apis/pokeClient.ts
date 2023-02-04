import axios from "axios";

export const pokeClient = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});
