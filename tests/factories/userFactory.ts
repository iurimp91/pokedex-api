import { getRepository } from "typeorm";

import User from "../../src/entities/User";

import bcrypt from "bcrypt";

export async function createUser (email: string, password: string) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  const user = await getRepository(User).create({
    email,
    password: hashedPassword,
  });

  await getRepository(User).save(user);

  return user;
}