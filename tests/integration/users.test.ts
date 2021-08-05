import supertest from "supertest";
import { getConnection } from "typeorm";

import app, { init } from "../../src/app";
import { clearDatabase } from "../utils/database";

import * as userService from "../../src/services/userService";

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
