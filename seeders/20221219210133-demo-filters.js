"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Filters", [
      {
        filterName: "clarendon",
      },
      {
        filterName: "gingham",
      },
      {
        filterName: "moon",
      },
      {
        filterName: "lark",
      },
      {
        filterName: "reyes",
      },
      {
        filterName: "juno",
      },

      {
        filterName: "slumber",
      },
      {
        filterName: "crema",
      },
      {
        filterName: "ludwig",
      },
      {
        filterName: "aden",
      },

      {
        filterName: "perpetua",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Filters", null, {});
  },
};
