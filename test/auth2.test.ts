import request from "supertest";
import app from "../src/app"; // path to your server.ts
const { User, Profile_picture, Follower } = require("../models"); // import your models
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { sequelize } = require("../models");

jest.mock("../src/helpers/seedUser");
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

  // Add more test cases like for wrong password, user not found, etc.
});
