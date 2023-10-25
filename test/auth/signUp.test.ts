import request from "supertest";
import app from "../../src/app"; // path to your server.ts
const { User, Profile_picture, Follower, sequelize } = require("../../models"); // import your models
import bcrypt from "bcrypt";

jest.mock("../../src/helpers/seedUser");
jest.mock("bcrypt");

describe("createUser controller", () => {
  const mockUser = {
    email: "test1234@example.com",
    password: "test1234",
    username: "testUser123",
    fullName: "Test User",
    dob: "1990-01-01",
    bio: "test bio",
  };

  let transaction: any = {};

  beforeEach(async () => {
    transaction = await sequelize.transaction();

    const originalCreate = User.create.bind(User);

    // Mock the User.create method to use the transaction
    jest.spyOn(User, "create").mockImplementation((userData) => {
      return originalCreate(userData, { transaction });
    });

    const originalCreate2 = Profile_picture.create.bind(Profile_picture);

    // Mock the Profile_picture.create method to use the transaction
    jest.spyOn(Profile_picture, "create").mockImplementation((userData) => {
      return originalCreate2(userData, { transaction });
    });
  });

  afterEach(async () => {
    // Clear the mock to restore the original behavior
    jest.restoreAllMocks();

    // Rollback the transaction
    await transaction.rollback();
  });

  it("should create user and return user object and token", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    const response = await request(app)
      .post("/auth/signup")
      .send({ userData: mockUser });
    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      token: expect.any(String),
      user: {
        id: expect.any(Number),
        email: "test1234@example.com",
        username: "testUser123",
        fullName: "Test User",
        dob: "1990-01-01",
        bio: "test bio",
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
        avatar: "default.png",
      },
    });

    expect(response.body.user).not.toHaveProperty("password");
  });
  it("should create user and return user object and token if unessential fields are omitted", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    const mockUser = {
      email: "test1234@example.com",
      password: "test1234",
      username: "testUser123",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send({ userData: mockUser });
    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      token: expect.any(String),
      user: {
        id: expect.any(Number),
        email: "test1234@example.com",
        username: "testUser123",
        fullName: null,
        dob: null,
        bio: null,
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
        avatar: "default.png",
      },
    });
  });
  it("should return 400 if essential field is omitted", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    const mockUser = {
      password: "test1234",
      username: "testUser123",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send({ userData: mockUser });
    expect(response.status).toBe(400);

    console.log(response.body);
    expect(response.body).toEqual({
      message: "Invalid data format",
    });
  });
  it("should return 400 if incorrectly formatted email provided", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    const mockUser = {
      password: "test1234",
      username: "testUser123",
      email: "test1234example.com",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send({ userData: mockUser });
    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Invalid data format",
    });
  });
  it("should return 409 if user already exists", async () => {
    // Mock only the findOne method for this test case
    const mockFindOne = jest.spyOn(User, "findOne").mockResolvedValueOnce({
      email: "test1234@example.com",
    });

    const mockUser = {
      password: "test1234",
      username: "testUser123",
      email: "test1234@example.com",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send({ userData: mockUser });

    expect(response.status).toBe(409);

    expect(response.body).toEqual({
      message: "Email already exists",
    });

    // Clean up after test
    mockFindOne.mockRestore();
  });
  it("should return 409 if username already exists", async () => {
    // Mock only the findOne method for this test case
    const mockFindOne = jest.spyOn(User, "findOne").mockResolvedValueOnce({
      username: "testUser123",
    });

    const mockUser = {
      password: "test1234",
      username: "testUser123",
      email: "test1234@example.com",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send({ userData: mockUser });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: "Username already exists",
    });

    // Clean up after test
    mockFindOne.mockRestore();
  });

  it("should handle errors gracefully", async () => {
    // Mock only the findOne method for this test case
    const mockFindOne = jest
      .spyOn(User, "findOne")
      .mockRejectedValueOnce(new Error("Error searching for users"));

    const mockUser = {
      password: "test1234",
      username: "testUser123",
      email: "test1234@example.com",
    };

    const response = await request(app)
      .post("/auth/signup")
      .send({ userData: mockUser });

    expect(response.status).toBe(500);
    // expect(response.body).toBe("Error searching for users");
  });
});
