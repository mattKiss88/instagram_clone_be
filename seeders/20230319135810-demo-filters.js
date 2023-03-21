"use strict";

/** @type {import('sequelize-cli').Migration} */
(
  module.exports = {
    async up(queryInterface, Sequelize) {
      return queryInterface.bulkInsert("Filters", [
        {
          filterName: "clarendon",
          filterDetails: null,
        },
        {
          filterName: "gingham",
          filterDetails: null,
        },
        {
          filterName: "moon",
          filterDetails: null,
        },
        {
          filterName: "lark",
          filterDetails: null,
        },
        {
          filterName: "reyes",
          filterDetails: null,
        },
        {
          filterName: "juno",
          filterDetails: null,
        },
        {
          filterName: "slumber",
          filterDetails: null,
        },
        {
          filterName: "crema",
          filterDetails: null,
        },
        {
          filterName: "ludwig",
          filterDetails: null,
        },
        {
          filterName: "aden",
          filterDetails: null,
        },
        {
          filterName: "perpetua",
          filterDetails: null,
        },
      ]);
    },

    async down(queryInterface, Sequelize) {
      return queryInterface.bulkDelete("Filters", null, {});
    },
  }
);
