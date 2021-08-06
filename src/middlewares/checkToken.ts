import { Request, Response, NextFunction } from "express";

import * as pokemonService from "../services/pokemonService";

export default async function checkToken(req: Request, res: Response, next: NextFunction) {
    const header = req.header("Authorization");

    if (!header) return res.sendStatus(400);

    const token = header.split("Bearer ")[1];

    const user = await pokemonService.authenticate(token);

    if (user === false) {
        return res.sendStatus(401);
    } else {
        res.locals.user = user;
        next();
    }
}