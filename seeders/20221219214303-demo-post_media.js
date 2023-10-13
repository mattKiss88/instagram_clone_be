"use strict";
/** @type {import('sequelize-cli').Migration} */
const AWS = require("aws-sdk");
const posts_media = [];
const { postImgs } = require("../src/helpers/s3FileIds.ts");

for (let i = 1; i < 400; i++) {
  const postId = i;
  const filterId = Math.floor(Math.random() * 11) + 1;
  posts_media.push({
    postId: postId,
    filterId: filterId,
    position: 1,
    mediaFileId: postImgs[Math.floor(Math.random() * postImgs.length)],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Post_media", posts_media);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Post_media", null, {});
  },
};
