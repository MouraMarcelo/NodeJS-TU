import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User0",
      email: "user0@finapi.com",
      password: "12345"
    })

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user with exists email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User0",
        email: "user@finapi.com",
        password: "12345"
      });

      await createUserUseCase.execute({
        name: "User1",
        email: "user@finapi.com",
        password: "54321"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
})
