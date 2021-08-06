import supertest from "supertest";
import { getConnection, getRepository } from "typeorm";

import app, { init } from "../../src/app";
import { clearDatabase } from "../utils/database";

import * as userService from "../../src/services/userService";

import { createUser } from "../factories/userFactory";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await getConnection().close();
});

describe("GET /pokemons", () => {
  it("should answer with status 400 for inexistent headers", async () => {
    const response = await supertest(app).get("/pokemons");

    expect(response.status).toBe(400);
  });

  it("should answer with status 401 for invalid token", async () => {
    const user = await createUser("test@test.com", "123456");
    
    const token = await userService.signIn("test@test.com", "123456");

    const response = await supertest(app).get("/pokemons").set("Authorization", "fake");

    expect(response.status).toBe(401);
  });

  it("should answer with status 200 and an array of objects for valid params", async () => {
    const user = await createUser("test@test.com", "123456");
    
    const token = await userService.signIn("test@test.com", "123456");

    const response = await supertest(app).get("/pokemons").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          number: expect.any(Number),
          image: expect.any(String),
          weight: expect.any(Number),
          height: expect.any(Number),
          baseExp: expect.any(Number),
          description: expect.any(String),
          inMyPokemons: expect.any(Boolean),
        })
      ])
    );
  });
});