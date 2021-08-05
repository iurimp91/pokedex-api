import { Request, Response } from "express";

import * as userService from "../services/userService";

import SignUpParams from "../interfaces/SignUpParams";
import SignUpParamsValidation from "../validations/SignUpParamsValidation";

export async function signUp (req: Request, res: Response) {
  try {
    const params = req.body as SignUpParams;
    const validBody: SignUpParams = await SignUpParamsValidation(params);

    const userExists = await userService.signUp(validBody);
    
    if (userExists === true) return res.sendStatus(409);

    return res.sendStatus(201);
  } catch (err) {
    console.error(err.message);
    if (
        err.message.includes("required")
        || err.message.includes("password")
    ) {
      return res.sendStatus(400);
    } else {
      return res.sendStatus(500);
    }
  }
}