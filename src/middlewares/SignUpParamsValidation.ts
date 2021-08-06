import joi from "joi";
import SignUpParams from "../interfaces/SignUpParams";
import { Request, Response, NextFunction } from "express";

export default async function SignUpParamsValidation (req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.body.confirmPassword) {
            console.log(`"confirmPassword" is required`);
            return res.sendStatus(400);
        }
        
        const schema = joi.object({
            email: joi.string().email().trim().required(),
            password: joi.string().min(6).trim().required(),
            confirmPassword: joi.ref("password"),
        });
        
        const validParams: SignUpParams = await schema.validateAsync(req.body);
    
        res.locals.signUpParams = validParams;
        next();
    } catch(err) {
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
};