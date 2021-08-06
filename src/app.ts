import "./setup";

import express, {NextFunction, Request, Response} from "express";
import cors from "cors";
import "reflect-metadata";

import connectDatabase from "./database";

import * as userController from "./controllers/userController";
import * as pokemonController from "./controllers/pokemonController";

import checkToken from "./middlewares/checkToken";
import SignUpParamsValidation from "./middlewares/SignUpParamsValidation";

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
// app.post("/my-pokemons/:id/remove", pokemonController.releasePokemon)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  return res.sendStatus(500);
});

export async function init () {
  await connectDatabase();
}

export default app;
