import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app"

import createConnection from "../../../../database";

let connection: Connection;

describe("Get User Balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get user balance", async () => {

  });

  it("should not be able to show a nonexistent user balance", async () => {

  });
})
