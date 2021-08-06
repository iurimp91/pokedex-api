import { Response } from "express";

export default function sendError (err: Error, res: Response) {
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