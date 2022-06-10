import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalance: GetBalanceUseCase;

describe("Get User Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalance = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
      );
  });

  it("should be able to get user balance", async () => {
    const user = await createUserUseCase.execute({
      name: "User0",
      email: "user0@finapi.com",
      password: "12345"
    });

    const response = await getBalance.execute({
      user_id: user.id as string
    });

    expect(response).toHaveProperty("balance");
  });

  it("should not be able to show a nonexistent user balance", () => {
    expect(async () => {
      await getBalance.execute({
        user_id: "invalid_id"
      })
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
})
