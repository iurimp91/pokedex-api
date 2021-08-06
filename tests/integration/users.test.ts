import supertest from "supertest";
import { getConnection, getRepository } from "typeorm";
import Session from "../../src/entities/Session";

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

describe("POST /sign-up", () => {
  it("should answer with status 400 for body not containing email, password or confirmPassword", async () => {
    const body = { password: "123456", confirmPassword: "123456" };

    const response = await supertest(app).post("/sign-up").send(body);

    expect(response.status).toBe(400);
  });

  it("should answer with status 400 for invalid email", async () => {
    const body = { email: "test.com", password: "123456", confirmPassword: "123456" };

    const response = await supertest(app).post("/sign-up").send(body);

    expect(response.status).toBe(400);
  });

  it("should answer with status 400 for not matching password and confirmPassword", async () => {
    const body = { email: "test@test.com", password: "123456", confirmPassword: "654321" };

    const response = await supertest(app).post("/sign-up").send(body);

    expect(response.status).toBe(400);
  });

  it("should answer with status 409 for already cadastred email", async () => {
    const body = { email: "test@test.com", password: "123456", confirmPassword: "123456" };

    const firstTry = await supertest(app).post("/sign-up").send(body);

    expect(firstTry.status).toBe(201);

    const secondTry = await supertest(app).post("/sign-up").send(body);

    expect(secondTry.status).toBe(409);
  });

  it("should answer with status 201 and create user for valid params", async () => {
    const body = { email: "test@test.com", password: "123456", confirmPassword: "123456" };

    const response = await supertest(app).post("/sign-up").send(body);

    const users = await userService.findByEmail(body.email)
  
    expect(users.length).toBe(1);
    expect(response.status).toBe(201);
  });
});

describe("POST /sign-in", () => {
  it("should answer with status 400 for body not containing email or password", async () => {
    await createUser("test@test.com", "123456");
    
    const body = { password: "123456" };

    const response = await supertest(app).post("/sign-in").send(body);

    expect(response.status).toBe(400);
  });

  it("should answer with status 400 for invalid email", async () => {
    await createUser("test@test.com", "123456");
    
    const body = { email: "testtt@test.com", password: "123456" };

    const response = await supertest(app).post("/sign-in").send(body);

    expect(response.status).toBe(400);
  });

  it("should answer with status 401 for invalid password", async () => {
    await createUser("test@test.com", "123456");
    
    const body = { email: "test@test.com", password: "654321" };

    const response = await supertest(app).post("/sign-in").send(body);

    expect(response.status).toBe(401);
  });

  it("should answer with status 200 and return token for valid params", async () => {
    await createUser("test@test.com", "123456");
    
    const body = { email: "test@test.com", password: "123456" };

    const response = await supertest(app).post("/sign-in").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String)
    }));
  });

  it("should answer with status 200 and create a session for valid params", async () => {
    await createUser("test@test.com", "123456");
    
    const body = { email: "test@test.com", password: "123456" };

    const response = await supertest(app).post("/sign-in").send(body);

    const session = await getRepository(Session).find();
    
    expect(response.status).toBe(200);
    expect(session.length).toBe(1);
  });
});

