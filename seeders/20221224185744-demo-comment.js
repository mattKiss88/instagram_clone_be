"use strict";
const { randLine } = require("@ngneat/falso");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Comments", [
      {
        id: 1,
        createdByUserId: 1,
        postId: 1,
        comment: "Nice post, I like it a lot ! ",
        commentRepliedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,

        createdByUserId: 1,
        postId: 1,
        comment:
          "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod jana leto gerado sequil renugna, lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod jana leto gerado sequil renugna, lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod jana leto gerado sequil renugna",
        commentRepliedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,

        createdByUserId: 2,
        postId: 1,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        createdByUserId: 2,
        postId: 2,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,

        createdByUserId: 2,
        postId: 1,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        createdByUserId: 4,
        postId: 7,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        createdByUserId: 4,
        postId: 3,
        comment: randLine({ lineCount: 2 }),
        commentRepliedToId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        createdByUserId: 2,
        postId: 1,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        createdByUserId: 2,
        postId: 6,
        comment: randLine({ lineCount: 2 }),
        commentRepliedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        createdByUserId: 2,
        postId: 3,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 11,
        createdByUserId: 3,
        postId: 1,
        comment: randLine({ lineCount: 2 }),
        commentRepliedToId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 12,
        createdByUserId: 3,
        postId: 6,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 13,
        createdByUserId: 3,
        postId: 5,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 14,
        createdByUserId: 4,
        postId: 1,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 15,
        createdByUserId: 4,
        postId: 1,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 16,
        createdByUserId: 4,
        postId: 1,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 17,
        createdByUserId: 5,
        postId: 1,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 18,
        createdByUserId: 5,
        postId: 4,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 19,
        createdByUserId: 5,
        postId: 1,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 20,
        createdByUserId: 1,
        postId: 2,
        comment: randLine({ lineCount: 1 }),
        commentRepliedToId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Comments", null, {});
  },
};
