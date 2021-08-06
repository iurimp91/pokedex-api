import supertest from "supertest";
import { getConnection, getRepository } from "typeorm";

import app, { init } from "../../src/app";
import { clearDatabase } from "../utils/database";

import * as userService from "../../src/services/userService";

import { createUser } from "../factories/userFactory";
import UserPokemon from "../../src/entities/UserPokemon";

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

describe("POST /my-pokemons/:id/add", () => {
  it("should answer with status 500 for invalid id", async () => {
    const user = await createUser("test@test.com", "123456");
    
    const token = await userService.signIn("test@test.com", "123456");
    
    const response = await supertest(app).post("/my-pokemons/fakeId/add").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
  });

  it("should answer with status 401 for invalid token", async () => {
    const user = await createUser("test@test.com", "123456");
    
    const token = await userService.signIn("test@test.com", "123456");

    const response = await supertest(app).post("/my-pokemons/1/add").set("Authorization", "fake");

    expect(response.status).toBe(401);
  });

  it("should answer with status 200 and add pokemon in user list for valid params", async () => {
    const user = await createUser("test@test.com", "123456");
    
    const token = await userService.signIn("test@test.com", "123456");

    const response = await supertest(app).post("/my-pokemons/1/add").set("Authorization", `Bearer ${token}`);

    const userPokemons = await getRepository(UserPokemon).find({
      where: { userId: user.id },
    });

    expect(response.status).toBe(200);
    expect(userPokemons.length).toBe(1);
  });
});

describe("POST /my-pokemons/:id/remove", () => {
  it("should answer with status 500 for invalid id", async () => {
    const user = await createUser("test@test.com", "123456");
    
    const token = await userService.signIn("test@test.com", "123456");
    
    const response = await supertest(app).post("/my-pokemons/fakeId/remove").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
  });

  it("should answer with status 401 for invalid token", async () => {
    const user = await createUser("test@test.com", "123456");
    
    const token = await userService.signIn("test@test.com", "123456");

    const response = await supertest(app).post("/my-pokemons/1/remove").set("Authorization", "fake");

    expect(response.status).toBe(401);
  });

  it("should answer with status 200 and remove pokemon in user list for valid params", async () => {
    const user = await createUser("test@test.com", "123456");
    
    const token = await userService.signIn("test@test.com", "123456");

    await supertest(app).post("/my-pokemons/1/add").set("Authorization", `Bearer ${token}`);
    
    const firstTry = await getRepository(UserPokemon).find({
      where: { userId: user.id },
    });
    
    const removeResponse = await supertest(app).post("/my-pokemons/1/remove").set("Authorization", `Bearer ${token}`);

    const userPokemons = await getRepository(UserPokemon).find({
      where: { userId: user.id },
    });

    expect(firstTry.length).toBe(1);
    expect(removeResponse.status).toBe(200);
    expect(userPokemons.length).toBe(0);
  });
});