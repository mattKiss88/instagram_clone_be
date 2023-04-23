"use strict";

/** @type {import('sequelize-cli').Migration} */

const friendshipArray = [];

function friendshipExists(followingUserId, followerUserId) {
  return friendshipArray.some(
    (friendship) =>
      friendship.followingUserId === followingUserId &&
      friendship.followerUserId === followerUserId
  );
}

for (let i = 1; i < 1000; i++) {
  const followingUserId = Math.floor(Math.random() * 100) + 1;
  const followerUserId = Math.floor(Math.random() * 100) + 1;

  if (followingUserId === followerUserId) continue;

  if (!friendshipExists(followingUserId, followerUserId)) {
    friendshipArray.push({
      followingUserId: followingUserId,
      followerUserId: followerUserId,
      createdAt: new Date(),
    });
  }
}

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Followers", friendshipArray);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Followers", null, {});
  },
};
