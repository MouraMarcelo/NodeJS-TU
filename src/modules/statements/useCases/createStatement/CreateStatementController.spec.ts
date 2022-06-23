import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app"

import createConnection from "../../../../database";

let connection: Connection;
let token: string;

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

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

    token = responseToken.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create statement", async () => {
    const responseDeposit = await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 10,
      description: "Deposit description"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(responseDeposit.status).toBe(201);
  });

  it("should not be able create statement with nonexistent user", async () => {
    const response = await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 10,
      description: "Invalid User description"
    }).set({
      Authorization: `Bearer invalid_token`
    });

    expect(response.status).toBe(401)
  });

  it("should not be able create withdraw statement with insufficient amount", async () => {
    await request(app).post("/api/v1/statements/deposit")
    .send({
      amount: 10,
      description: "Deposit description"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    const response = await request(app).post("/api/v1/statements/withdraw")
    .send({
      amount: 100,
      description: "Withdraw description"
    })
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(400);
  });
})
