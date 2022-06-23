import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app"

import createConnection from "../../../../database";

let connection: Connection;

describe("Get Statement Operation", () => {
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

  it("should not be able to get statement with nonexistent user", () => {

  });

  it("should not be able to get statement with invalid statement id", () => {

  });
})
