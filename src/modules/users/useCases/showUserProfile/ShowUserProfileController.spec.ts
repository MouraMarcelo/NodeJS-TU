import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app"

import createConnection from "../../../../database";

let connection: Connection;

describe("Show User Profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show user profile", async () => {
    const user = {
      name: "User0",
      email: "user@finapi.com",
      password: "12345"
    }

    await request(app).post("/api/v1/users").send(user);

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    });

    const { token } = responseToken.body;

    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`
    });

    expect(response.body.name).toBe(user.name);
    expect(response.body.email).toBe(user.email);
  });

  it("should not be able to show a invalid user profile", async () => {
    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer invalid_token`
    });

    expect(response.status).toBe(401)
  });
})
