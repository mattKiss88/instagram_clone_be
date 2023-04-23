"use strict";
// import {
//   randEmail,
//   randFullName,
//   randUserName,
//   randPassword,
// } from "@ngneat/falso";

// require

const {
  randEmail,
  randFullName,
  randUserName,
  randPassword,
} = require("@ngneat/falso");

/** @type {import('sequelize-cli').Migration} */

let users = [];

for (let i = 0; i < 100; i++) {
  users.push({
    username: randUserName(),
    fullName: randFullName(),
    dob: "1960-01-01",
    email: randEmail(),
    password: randPassword(),
    bio: "I am a user",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", users);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
