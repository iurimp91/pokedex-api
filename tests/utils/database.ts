import { getRepository, getConnection } from "typeorm";

import Session from "../../src/entities/Session";
import User from "../../src/entities/User";

export async function clearDatabase () {
  await getRepository(Session).delete({});
  await getRepository(User).delete({});
  await getConnection().query(`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
  await getConnection().query(`ALTER SEQUENCE sessions_id_seq RESTART WITH 1`);
}
