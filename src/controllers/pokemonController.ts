import { Request, Response } from "express";

import * as pokemonService from "../services/pokemonService";

export async function getPokemons (req: Request, res: Response) {
  try {
    const header = req.header("Authorization");
    const token = header.split("Bearer ")[1];

    const user = await pokemonService.authenticate(token);

    if (user === false) return res.sendStatus(401);

    const pokemons = await pokemonService.getPokemons(user.id)

    return res.send(pokemons);
  } catch (err) {
    console.error(err.message);
    return res.sendStatus(500);
  }
}