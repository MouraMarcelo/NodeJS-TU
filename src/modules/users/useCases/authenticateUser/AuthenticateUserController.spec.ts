import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app"

import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    const user ={
      name: "User0",
      email: "user0@finapi.com",
      password: "12345"
    }

    await request(app).post("/api/v1/users").send(user);

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    });

    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistent", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "invalid@finapi.com",
      password: "12345"
    })

    expect(response.status).toBe(401)
  })

  it("should not be able to authenticate with an incorrect password", async () => {
    const user ={
      name: "User1",
      email: "user1@finapi.com",
      password: "12345"
    }

    await request(app).post("/api/v1/users").send(user)

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: "wrong_password"
    })

    expect(response.status).toBe(401)
  });
})
