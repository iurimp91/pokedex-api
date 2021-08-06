import { Request, Response } from "express";

import * as userService from "../services/userService";

import SignUpParams from "../interfaces/SignUpParams";
import SignUpParamsValidation from "../middlewares/SignUpParamsValidation";

export async function signUp (req: Request, res: Response) {
  const emailExists = await userService.signUp(res.locals.signUpParams);
  
  if (emailExists === true) {
    console.log("email is already being used");
    return res.sendStatus(409);
  }

  return res.sendStatus(201);
}

export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body as {email: string, password: string};

  if (!email || !password) return res.sendStatus(400);

  const token = await userService.signIn(email, password);

  if (token === null) {
    return res.sendStatus(400);
  } else if (token === false) {
    return res.sendStatus(401);
  } else {
    return res.send({ token });
  }
}