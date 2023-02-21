import axios from "axios";

export const pokeClient = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

export const pokeGatewayClient = axios.create({
  baseURL: "https://poke-api-gateway.onrender.com",
});
