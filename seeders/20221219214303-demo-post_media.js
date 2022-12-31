"use strict";

/** @type {import('sequelize-cli').Migration} */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Post_media", [
      {
        postId: 1,
        filterId: 1,
        mediaFileId: "random1.jpg",
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 1,
        filterId: 3,
        mediaFileId: "random2.jpg",
        position: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 2,
        filterId: 3,
        mediaFileId: "random3.jpg",
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 3,
        filterId: null,
        mediaFileId: "random4.jpg",
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 4,
        filterId: 6,
        mediaFileId: "random5.jpg",
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 5,
        filterId: null,
        mediaFileId: "random6.jpg",
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 6,
        filterId: null,
        mediaFileId: "random7.jpg",
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 7,
        filterId: null,
        mediaFileId: "random8.jpg",
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 8,
        filterId: null,
        mediaFileId: "random9.jpg",
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 9,
        filterId: 4,
        mediaFileId: "random10.jpg",
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        postId: 10,
        filterId: null,
        mediaFileId: "random11.jpg",
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Post_media", null, {});
  },
};
