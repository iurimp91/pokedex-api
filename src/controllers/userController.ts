import { Request, Response } from "express";

import * as userService from "../services/userService";

import SignUpParams from "../interfaces/SignUpParams";
import { SignUpParamsValidation } from "../validations/ParamsValidation";

export async function signUp (req: Request, res: Response) {
  try {
    const params = req.body as SignUpParams;
    
    if (!params.confirmPassword) {
      console.log(`"confirmPassword" is required`);
      return res.sendStatus(400);
    }

    const validBody: SignUpParams = await SignUpParamsValidation(params);

    const emailExists = await userService.signUp(validBody);
    
    if (emailExists === true) {
      console.log("email is already being used");
      return res.sendStatus(409);
    }

    return res.sendStatus(201);
  } catch (err) {
    console.error(err.message);
    if (
        err.message.includes("email")
        || err.message.includes("password")
    ) {
      return res.sendStatus(400);
    } else {
      return res.sendStatus(500);
    }
  }
}

export async function signIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body as {email: string, password: string};

    if (!email || !password) return res.sendStatus(400);

    const token = await userService.signIn(email, password);

    if (token === null) {
      return res.sendStatus(400);
    } else  if (token === false) {
      return res.sendStatus(401);
    } else {
      return res.send({ token });
    }
  } catch(err) {
    console.log(err.message);
    return res.sendStatus(500);
  }
}