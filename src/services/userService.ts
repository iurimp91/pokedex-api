import { getRepository } from "typeorm";

import User from "../entities/User";
import SignUpParams from "../interfaces/SignUpParams";

import bcrypt from "bcrypt";

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

export { signUp, findByEmail }
