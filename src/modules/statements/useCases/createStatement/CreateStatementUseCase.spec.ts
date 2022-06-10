import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

import { OperationType } from "./../../entities/Statement"

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create statement", async () => {
    const user = await createUserUseCase.execute({
      name: "User0",
      email: "user0@finapi.com",
      password: "12345"
    });

    const response = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Statement Description"
    });

    expect(response).toHaveProperty("id");
  });

  it("should not be able create statement with nonexistent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "invalid_id",
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "Statement Description"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able create withdraw statement with insufficient amount", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "User0",
        email: "user0@finapi.com",
        password: "12345"
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Statement Description"
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: "Statement Description"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
})
