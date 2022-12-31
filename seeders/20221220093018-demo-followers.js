"use strict";

/** @type {import('sequelize-cli').Migration} */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Followers", [
      {
        followingUserId: 1,
        followerUserId: 2,
        createdAt: new Date(),
      },
      {
        followingUserId: 1,
        followerUserId: 3,
        createdAt: new Date(),
      },
      {
        followingUserId: 1,
        followerUserId: 4,
        createdAt: new Date(),
      },
      {
        followingUserId: 1,
        followerUserId: 5,
        createdAt: new Date(),
      },
      {
        followingUserId: 2,
        followerUserId: 1,
        createdAt: new Date(),
      },
      {
        followingUserId: 2,
        followerUserId: 3,
        createdAt: new Date(),
      },
      {
        followingUserId: 2,
        followerUserId: 4,
        createdAt: new Date(),
      },
      {
        followingUserId: 2,
        followerUserId: 5,
        createdAt: new Date(),
      },
      {
        followingUserId: 3,
        followerUserId: 1,
        createdAt: new Date(),
      },
      {
        followingUserId: 3,
        followerUserId: 4,
        createdAt: new Date(),
      },
      {
        followingUserId: 3,
        followerUserId: 5,
        createdAt: new Date(),
      },
      {
        followingUserId: 4,
        followerUserId: 1,
        createdAt: new Date(),
      },
      {
        followingUserId: 4,
        followerUserId: 2,
        createdAt: new Date(),
      },
      {
        followingUserId: 4,
        followerUserId: 3,
        createdAt: new Date(),
      },
      {
        followingUserId: 5,
        followerUserId: 1,
        createdAt: new Date(),
      },
      {
        followingUserId: 5,
        followerUserId: 2,
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Followers", null, {});
  },
};
