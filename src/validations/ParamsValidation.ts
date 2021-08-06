import joi from "joi";
import SignUpParams from "../interfaces/SignUpParams";

export async function SignUpParamsValidation (params: SignUpParams): Promise<SignUpParams> {
    const schema = joi.object({
        email: joi.string().email().trim().required(),
        password: joi.string().min(6).trim().required(),
        confirmPassword: joi.ref("password"),
    });

    const validParams = await schema.validateAsync(params);

    return validParams;
};