import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const user = {
      name: "User",
      email: "user@finapi.com",
      password: "12345"
    }

    await createUserUseCase.execute(user);

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(response).toHaveProperty("token");
  });

  it("should not be able to authenticate an nonexistent", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@test.com",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })

  it("should not be able to authenticate with an incorrect password", async () => {
    expect(async () => {
      const user = {
        name: "User",
        email: "user@finapi.com",
        password: "12345"
      }

      await createUserUseCase.execute(user);

      const response = await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrong_password"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})
