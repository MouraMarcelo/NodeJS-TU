import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "User0",
      email: "user0@finapi.com",
      password: "12345"
    });

    const response = await showUserProfileUseCase.execute(user.id as string);

    expect(response.name).toEqual(user.name);
    expect(response.email).toEqual(user.email);
  });

  it("should not be able to show a invalid user profile", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("invalid_id")
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
})
