"use strict";
const { randTextRange } = require("@ngneat/falso");

/** @type {import('sequelize-cli').Migration} */

const commentsByPost = {};
const comments = [];

for (let i = 0; i < 3000; i++) {
  const createdByUserId = Math.floor(Math.random() * 100) + 1;
  const postId = Math.floor(Math.random() * 399) + 1;
  const comment = randTextRange({ min: 10, max: 150 });
  const hasReplyTo = Math.random() <= 0.25;

  let commentRepliedToId = null;
  if (
    hasReplyTo &&
    commentsByPost[postId] &&
    commentsByPost[postId].length > 0
  ) {
    // Ensuring the commentRepliedToId refers to an existing comment of the same postId
    const commentIndex = Math.floor(
      Math.random() * commentsByPost[postId].length
    );
    commentRepliedToId = commentsByPost[postId][commentIndex].id; // assuming there is an id field in your comment object
  }

  const newComment = {
    id: i + 1,
    createdByUserId: createdByUserId,
    postId: postId,
    comment: comment,
    commentRepliedToId: commentRepliedToId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (!commentsByPost[postId]) {
    commentsByPost[postId] = [newComment];
  } else {
    commentsByPost[postId].push(newComment);
  }

  comments.push(newComment);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Comments", comments);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Comments", null, {});
  },
};
