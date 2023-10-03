import request from "supertest";
import app from "../../src/app";
import { authenticateToken } from "../../src/middleware/auth";
const { User, Follower, sequelize } = require("../../models");

jest.mock("../../src/middleware/auth");

describe("followUser controller", () => {
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
  ];
  let transaction: any;

  let followingUserId: number;

  beforeEach(async () => {
    // Start a transaction
    transaction = await sequelize.transaction();

    // Seed your database
    let users = await User.bulkCreate(mockUsers, { transaction });

    const ids = users.map((user: any) => user.id);

    followingUserId = ids[1];

    (authenticateToken as jest.Mock).mockImplementation(
      (req: any, res: any, next: any) => {
        req.user = {
          id: ids[0],
        };
        next();
      }
    );
  });

  afterEach(async () => {
    jest.restoreAllMocks();

    await transaction.rollback();
  });

  it("Should follow the target user without errors", async () => {
    const originalCreate2 = Follower.create.bind(Follower);

    jest.spyOn(Follower, "create").mockImplementation((userData) => {
      return originalCreate2(userData, { transaction });
    });

    const response = await request(app)
      .post(`/user/follow`)
      .send({ userId: followingUserId });

    expect(response.status).toBe(201);
    expect(response.body.msg).toBe("You are now following this user");
    expect(response.body.follow).toBeInstanceOf(Object);
  });
  it("Should unfollow the target user without errors", async () => {
    const originalCreate2 = Follower.create.bind(Follower);

    jest.spyOn(Follower, "create").mockImplementation((userData) => {
      return originalCreate2(userData, { transaction });
    });

    jest.spyOn(Follower, "findOne").mockResolvedValue(true);

    const response = await request(app)
      .post(`/user/follow`)
      .send({ userId: followingUserId });

    expect(response.status).toBe(201);
    expect(response.body.msg).toBe("You have unfollowed this user");
  });
  it("Should return an error if ", async () => {
    const response = await request(app)
      .post(`/user/follow`)
      .send({ userId: "followingUserId" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid data format");
  });
  //   it("the limit query parameter is respected", async () => {
  //     const response = await request(app).get("/user/friends?limit=2");

  //     expect(response.status).toBe(200);
  //     expect(response.body.msg).toBe("You are now following this user");
  //     expect(response.body.follow).toBeInstanceOf(Object);
  //   });
  //   it("should return an empty array if user has no friends", async () => {
  //     let transaction: any;

  //     transaction = await sequelize.transaction();

  //     let user = await User.create(
  //       {
  //         email: "james@gmail.com",
  //         password: "testpword",
  //         username: "mattki55",
  //         fullName: "matt kirk",
  //       },
  //       { transaction }
  //     );

  //     (authenticateToken as jest.Mock).mockImplementation(
  //       (req: any, res: any, next: any) => {
  //         req.user = {
  //           id: user.id,
  //         };
  //         next();
  //       }
  //     );

  //     const response = await request(app).get("/user/friends?limit=2");

  //     expect(response.status).toBe(200);
  //     expect(response.body.followingUsers).toBeInstanceOf(Array);
  //     expect(response.body.followingUsers).toHaveLength(0);

  //     await transaction.rollback();
  //   });
});
