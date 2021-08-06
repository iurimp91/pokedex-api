import { getRepository } from "typeorm";

import Session from "../entities/Session";
import Pokemon from "../entities/Pokemon";
import UserPokemon from "../entities/UserPokemon";

import PokemonParams from "../interfaces/PokemonParams";

async function getPokemons (userId: number) {
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
      id: pokemon.id,
      name: pokemon.name,
      number: pokemon.number,
      image: pokemon.image,
      weight: pokemon.weight,
      height: pokemon.height,
      baseExp: pokemon.baseExp,
      description: pokemon.description,
      inMyPokemons: userPokemonsIds[pokemon.id] || false,
    };
  });

  return pokemons;
}

async function authenticate(token: string) {
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

export { getPokemons, authenticate }