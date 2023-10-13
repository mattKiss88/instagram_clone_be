import request from "supertest";
import app from "../../src/app"; // path to your server.ts
const { User, Profile_picture, Follower, sequelize } = require("../../models"); // import your models
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock the dependencies

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../models");

describe("getUser controller", () => {
  const mockUser = {
    email: "test@example.com",
    password: "hashedPassword",
  };

  it("should log in user and return user info and token", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (Follower.findAll as jest.Mock).mockResolvedValue([{ followingUserId: 2 }]);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("someToken");

    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "testPassword",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      accessToken: "someToken",
      user: mockUser,
      followingUsers: [2],
    });
  }),
    it("should return 401 if user not found (email that doesn't exist)", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "testPassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Invalid username or password.",
      });
    });
  it("should return 401 if password is incorrect", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "testPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Invalid username or password.",
    });
  });
  // Add more test cases like for wrong password, user not found, etc.
});
