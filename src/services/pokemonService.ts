import { getRepository } from "typeorm";

import Session from "../entities/Session";
import Pokemon from "../entities/Pokemon";
import UserPokemon from "../entities/UserPokemon";

import PokemonParams from "../interfaces/PokemonParams";

export async function getPokemons (userId: number) {
  const pokemonRepository = getRepository(Pokemon);
  const userPokemonsRepository = getRepository(UserPokemon);

  const pokemonsData = await pokemonRepository.find();

  const userPokemons = await userPokemonsRepository.find({
    where: { userId },
  });

  interface userPokemonsIds {
    [key: number]: boolean
  }

  const userPokemonsIds: userPokemonsIds = {};

  userPokemons.forEach(pokemon => {
    userPokemonsIds[pokemon.pokemonId] = true;
  });
  
  const pokemons: PokemonParams[] = pokemonsData.map(pokemon => {
    return {
      ...pokemon,
      inMyPokemons: userPokemonsIds[pokemon.id] || false,
    };
  });

  return pokemons;
}

export async function catchPokemon(userId: number, pokemonId: number) {
  const userPokemonsRepository = getRepository(UserPokemon);
  await userPokemonsRepository.insert({ userId, pokemonId });
}

export async function releasePokemon(userId: number, pokemonId: number) {
  const userPokemonsRepository = getRepository(UserPokemon);
  await userPokemonsRepository.delete({ userId, pokemonId });
}

export async function authenticate(token: string) {
  const sessionRepository = getRepository(Session);

  const session = await sessionRepository.findOne({
    where: { token },
    relations: ["user"],
  });

  if (!session) {
    return false;
  } else {
    return session.user;
  }
}