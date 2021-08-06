import "./setup";

import express, {NextFunction, Request, Response} from "express";
import cors from "cors";
import "reflect-metadata";

import connectDatabase from "./database";

import * as userController from "./controllers/userController";
import * as pokemonController from "./controllers/pokemonController";

import checkToken from "./middlewares/checkToken";
import SignUpParamsValidation from "./middlewares/SignUpParamsValidation";

import axios from "axios";
import { getRepository } from "typeorm";
import Pokemon from "./entities/Pokemon";

const app = express();
app.use(cors());
app.use(express.json());

// Rota: cadastro [pública]
app.post("/sign-up", SignUpParamsValidation, userController.signUp);

// Rota: login [pública]
app.post("/sign-in", userController.signIn);

// Rota: pegar todos pokemons [logado]
app.get("/pokemons", checkToken, pokemonController.getPokemons);

// Rota: adicionar pokemons na minha lista [logado]
app.post("/my-pokemons/:id/add", checkToken, pokemonController.catchPokemon)

// Rota: remover pokemons na minha lista [logado]
app.post("/my-pokemons/:id/remove", checkToken, pokemonController.releasePokemon)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  return res.sendStatus(500);
});

app.post("/populate", async (req,res)=>{
 
  for(let i = 1; i < 152; i ++){
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
    const newPokemon = {
      id: result.data.id,
      name: result.data.name,
      number: result.data.id,
      image: result.data.sprites.front_default,
      weight: result.data.weight,
      height: result.data.height,
      baseExp: result.data.base_experience,
      description: ""
    }
 
    const speciesResult = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${i}`)
    newPokemon.description = speciesResult.data.flavor_text_entries[0].flavor_text.split("\n").join(" ")
    const pokemon = getRepository(Pokemon).create(newPokemon)
    const resultquery = await getRepository(Pokemon).save(pokemon)
  }
  res.send("OK")
})

export async function init () {
  await connectDatabase();
}

export default app;
