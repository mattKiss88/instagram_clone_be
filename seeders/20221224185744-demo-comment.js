"use strict";
const { randTextRange } = require("@ngneat/falso");

/** @type {import('sequelize-cli').Migration} */

const comments = [];

for (let i = 0; i < 2000; i++) {
  const createdByUserId = Math.floor(Math.random() * 100) + 1;
  const postId = Math.floor(Math.random() * 399) + 1;
  const comment = randTextRange({ min: 10, max: 150 });
  const hasReplyTo = Math.random() <= 0.2;

  let commentRepliedToId = null;
  if (hasReplyTo && i > 0) {
    // Ensuring the commentRepliedToId refers to an existing comment
    commentRepliedToId = Math.floor(Math.random() * i) + 1;
  }

  comments.push({
    createdByUserId: createdByUserId,
    postId: postId,
    comment: comment,
    commentRepliedToId: commentRepliedToId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Comments", comments);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Comments", null, {});
  },
};
