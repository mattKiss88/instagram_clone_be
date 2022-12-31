"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Profile_pictures", [
      {
        mediaFileId: "random10.jpg",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        mediaFileId: "default.png",
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        mediaFileId: "random11.jpg",
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        mediaFileId: "default.png",
        userId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        mediaFileId: "random12.jpg",
        userId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Profile_pictures");
  },
};
