import { Request, Response } from "express";

import * as pokemonService from "../services/pokemonService";
import sendError from "../utils/sendError";

export async function getPokemons (req: Request, res: Response) {
  try {
    const userId = res.locals.user.id;
    const pokemons = await pokemonService.getPokemons(userId)
  
    return res.send(pokemons);
  } catch(err) {
    sendError(err, res);
  }
}

export async function catchPokemon (req: Request, res: Response) {
  try {
    const pokemonId = Number(req.params.id);

    const userId = res.locals.user.id;
  
    await pokemonService.catchPokemon(userId, pokemonId);
  
    return res.sendStatus(200);
  } catch(err) {
    sendError(err, res);
  }
}

export async function releasePokemon (req: Request, res: Response) {
  try {
    const pokemonId = Number(req.params.id);
    
    const userId = res.locals.user.id;
  
    await pokemonService.releasePokemon(userId, pokemonId);
  
    return res.sendStatus(200);
  } catch(err) {
    sendError(err, res);
  }
}