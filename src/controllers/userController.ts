import { Request, Response } from "express";

import * as userService from "../services/userService";

import SignUpParams from "../interfaces/SignUpParams";
import SignUpParamsValidation from "../validations/SignUpParamsValidation";

export async function signUp (req: Request, res: Response) {
  try {
    const params = req.body as SignUpParams;

    if (!params.confirmPassword) {
      console.log(`"confirmPassword" is required`);
      return res.sendStatus(400);
    }

    const validBody: SignUpParams = await SignUpParamsValidation(params);

    const userExists = await userService.signUp(validBody);
    
    if (userExists === true) {
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