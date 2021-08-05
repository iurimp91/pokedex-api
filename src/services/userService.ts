import { getRepository } from "typeorm";

import User from "../entities/User";
import SignUpParams from "../interfaces/SignUpParams";

import bcrypt from "bcrypt";

async function findByEmail (email: string) {
  const user = await getRepository(User).findOne({ email });
  
  return user;
}

async function signUp (params: SignUpParams) {
  const { email, password } = params;

  const user = await findByEmail(email);
  
  if (user) return true;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const repository = getRepository(User);
  await repository.insert({ email, password: hashedPassword });
}

export { signUp }
