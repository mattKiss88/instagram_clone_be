import request from "supertest";
import app from "../../src/app"; // path to your server.ts
import { authenticateToken } from "../../src/middleware/auth";
import { getUserDetails } from "../../src/helpers/getUserPostsAndStats";
const { User, Follower, sequelize } = require("../../models"); // import your models

jest.mock("../../src/middleware/auth");
jest.mock("../../src/helpers/getUserPostsAndStats");

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
      fullName: "Adam Smith",
    },
  ];
  let transaction: any;

  beforeEach(async () => {
    // Start a transaction
    transaction = await sequelize.transaction();

    // Seed your database
    let users = await User.bulkCreate(mockUsers, { transaction });

    const ids = users.map((user: any) => user.id);

    await Follower.bulkCreate(
      [
        {
          followerUserId: ids[0],
          followingUserId: ids[1],
        },
        {
          followerUserId: ids[0],
          followingUserId: ids[2],
        },
        {
          followerUserId: ids[0],
          followingUserId: ids[3],
        },
      ],
      { transaction }
    );

    (authenticateToken as jest.Mock).mockImplementation(
      (req: any, res: any, next: any) => {
        req.user = {
          id: ids[0],
        };
        next();
      }
    );

    (getUserDetails as jest.Mock).mockResolvedValue({
      posts: [],
      followers: [],
      following: [],
    });

    const originalFindAll = Follower.findAll.bind(Follower);

    jest.spyOn(Follower, "findAll").mockImplementation((options: any) => {
      return originalFindAll({ ...options, transaction });
    });
  });

  afterEach(async () => {
    jest.restoreAllMocks();

    await transaction.rollback();
  });

  it("should return an array of friends", async () => {
    const response = await request(app).get("/user/friends");

    expect(response.status).toBe(200);
    expect(response.body.followingUsers).toBeInstanceOf(Array);
    expect(response.body.followingUsers).toHaveLength(3);
  });

  it("the limit query parameter is respected", async () => {
    const response = await request(app).get("/user/friends?limit=2");

    expect(response.status).toBe(200);
    expect(response.body.followingUsers).toBeInstanceOf(Array);
    expect(response.body.followingUsers).toHaveLength(2);
  });
  it("should return an empty array if user has no friends", async () => {
    let transaction: any;

    transaction = await sequelize.transaction();

    let user = await User.create(
      {
        email: "james@gmail.com",
        password: "testpword",
        username: "mattki55",
        fullName: "matt kirk",
      },
      { transaction }
    );

    (authenticateToken as jest.Mock).mockImplementation(
      (req: any, res: any, next: any) => {
        req.user = {
          id: user.id,
        };
        next();
      }
    );

    const response = await request(app).get("/user/friends?limit=2");

    expect(response.status).toBe(200);
    expect(response.body.followingUsers).toBeInstanceOf(Array);
    expect(response.body.followingUsers).toHaveLength(0);

    await transaction.rollback();
  });
});
