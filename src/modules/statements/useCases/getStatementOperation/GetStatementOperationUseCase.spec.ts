import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { CreateStatementError } from "../createStatement/CreateStatementError";

import { OperationType } from "../../entities/Statement";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get user balance", async () => {
    const user = await createUserUseCase.execute({
      name: "User0",
      email: "user0@finapi.com",
      password: "12345"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Statement Description"
    });

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    })

    expect(response).toHaveProperty("id");
  });

  it("should not be able to get statement with nonexistent user", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "User0",
        email: "user0@finapi.com",
        password: "12345"
      });

      const statement = await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "Statement Description"
      });

      await getStatementOperationUseCase.execute({
        user_id: "invalid_user",
        statement_id: statement.id as string
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to get statement with invalid statement id", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "User0",
        email: "user0@finapi.com",
        password: "12345"
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "Statement Description"
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "invalid_statement"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})
