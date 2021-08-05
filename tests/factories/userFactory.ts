import { getRepository } from "typeorm";

import User from "../../src/entities/User";

export async function createUser (email: string, password: string) {
  const user = await getRepository(User).create({
    email,
    password
  });

  await getRepository(User).save(user);

  return user;
}