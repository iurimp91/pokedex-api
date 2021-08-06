import { Request, Response } from "express";

import * as pokemonService from "../services/pokemonService";

export async function getPokemons (req: Request, res: Response) {
    const userId = res.locals.user.id;
    const pokemons = await pokemonService.getPokemons(userId)

    return res.send(pokemons);
}

// export async function catchPokemon (req: Request, res: Response) {
//   try {

//   } catch (err) {
//     console.error(err.message);
//     return res.sendStatus(500);
//   }
// }