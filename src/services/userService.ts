import { getRepository } from "typeorm";

import User from "../entities/User";
import Session from "../entities/Session";
import SignUpParams from "../interfaces/SignUpParams";

import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

async function findByEmail (email: string) {
  const user = await getRepository(User).find({ email });
  
  return user;
}

async function signUp (params: SignUpParams) {
  const { email, password } = params;

  const user = await findByEmail(email);
  
  if (user.length !== 0) return true;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const repository = getRepository(User);
  await repository.insert({ email, password: hashedPassword });
}

async function signIn(email: string, password: string) {
  const user = await findByEmail(email);

  if (user.length === 0) return null;

  if (bcrypt.compareSync(password, user[0].password)) {
    const token = uuid();

    const repository = getRepository(Session);
    await repository.insert({ userId: user[0].id, token });

    return token;
  } else {
    return false;
  }
}

export { signUp, findByEmail, signIn }
