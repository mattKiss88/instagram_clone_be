import request from "supertest";
import app from "../../src/app"; // path to your server.ts
const { User, sequelize } = require("../../models"); // import your models

jest.mock("../../src/middleware/auth", () => {
  return {
    authenticateToken: (req: any, res: any, next: any) => {
      req.user = {
        username: "testUser017879",
        fullName: "David Smith",
      };
      next();
    },
  };
});

describe("searchUser controller", () => {
  const mockUsers = [
    {
      email: "testuser10909@example.com",
      password: "test1234",
      username: "testUser017879",
      fullName: "David Smith",
    },
    {
      email: "testuser200990@example.com",
      password: "test1234",
      username: "happydadyyy",
      fullName: "David Jones",
    },
    {
      email: "testuser30909@example.com",
      password: "test1234",
      username: "happymumyyy",
      fullName: "John Smith",
    },
    {
      email: "testuser40909@example.com",
      password: "test1234",
      username: "james",
      fullName: "Adammm Smith",
    },
  ];
  let transaction: any;

  beforeEach(async () => {
    // Start a transaction
    transaction = await sequelize.transaction();

    // Seed your database
    await User.bulkCreate(mockUsers, { transaction });

    const originalFindAll = User.findAll.bind(User);

    // Mock the User.create method to use the transaction
    jest.spyOn(User, "findAll").mockImplementation((options: any) => {
      return originalFindAll({ ...options, transaction });
    });
  });

  afterEach(async () => {
    // Rollback the transaction to undo all changes

    // Clear the mock to restore the original behavior
    jest.restoreAllMocks();

    await transaction.rollback();
  });

  it("should return an array of users when passed a string that matches the usernames", async () => {
    const response = await request(app).get("/user?search=happy");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].username).toBe("happydadyyy");
    expect(response.body[1].username).toBe("happymumyyy");
  });

  it("should return an array of users when passed a string that matches the full names", async () => {
    const response = await request(app).get("/user?search=adammm");

    console.log(
      response.body,
      "------------------------------------------------>"
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].fullName).toBe("Adam Smith");
  });
  it("should omit the user that made the request from the results ", async () => {
    const response = await request(app).get("/user?search=David Smith");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(0);
  });
  it("should return users in ascending username order", async () => {
    const response = await request(app).get("/user?search=Smith");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].username).toBe("happymumyyy");
  });
  it("should omit password from user object", async () => {
    const response = await request(app).get("/user?search=Smith");

    expect(response.body[0].password).toBeUndefined();
  });
  it("should handle errors gracefully", async () => {
    // Mock only the findOne method for this test case
    const mockFindAll = jest
      .spyOn(User, "findAll")
      .mockRejectedValueOnce(new Error("Error searching for users"));

    const response = await request(app).get("/user?search=Smith");

    expect(response.status).toBe(500);
  });
});
