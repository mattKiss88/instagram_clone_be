"use strict";

const { randLine } = require("@ngneat/falso");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Posts", [
      {
        userId: 1,
        caption: randLine({ lineCount: 1 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        userId: 1,
        caption:
          "lorum ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod jana leto gerado sequil renugna",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        userId: 2,
        caption: randLine({ lineCount: 2 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        userId: 2,
        caption: randLine({ lineCount: 3 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        userId: 3,
        caption: randLine({ lineCount: 1 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        userId: 3,
        caption: randLine({ lineCount: 1 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        userId: 4,
        caption: randLine({ lineCount: 1 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        userId: 4,
        caption: randLine({ lineCount: 1 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        userId: 5,
        caption: randLine({ lineCount: 1 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        userId: 5,
        caption: randLine({ lineCount: 1 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
