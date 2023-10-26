"use strict";

/** @type {import('sequelize-cli').Migration} */
const { avatarImgs } = require("../src/helpers/s3FileIds");

const profilePics = [];

for (let i = 1; i < 101; i++) {
  profilePics.push({
    mediaFileId: avatarImgs[Math.floor(Math.random() * avatarImgs.length)],
    userId: i,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Profile_pictures", profilePics);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Profile_pictures");
  },
};
