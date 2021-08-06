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

app.post("/sign-up", SignUpParamsValidation, userController.signUp);

app.post("/sign-in", userController.signIn);

app.get("/pokemons", checkToken, pokemonController.getPokemons);

app.post("/my-pokemons/:id/add", checkToken, pokemonController.catchPokemon)

app.post("/my-pokemons/:id/remove", checkToken, pokemonController.releasePokemon)

app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  return res.sendStatus(500);
});

export async function init () {
  await connectDatabase();
}

export default app;
