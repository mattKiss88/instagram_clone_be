"use strict";

const { randTextRange } = require("@ngneat/falso");

/** @type {import('sequelize-cli').Migration} */

const posts = [];

for (let i = 0; i < 400; i++) {
  const userId = Math.floor(Math.random() * 100) + 1;
  posts.push({
    userId: userId,
    caption: randTextRange({ min: 10, max: 100 }),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Posts", posts);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Posts", null, {});
  },
};
