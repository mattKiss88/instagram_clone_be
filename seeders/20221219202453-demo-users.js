"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Users", [
      {
        username: "james",
        fullName: "James Bond",
        dob: "1960-01-01",
        email: "jamesbond@gmail.com",
        password: "password",
        bio: "I'm a secret agent",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "jane",
        fullName: "Jane Doe",
        dob: "1970-01-01",
        email: "jane@gmail.com",
        password: "password",
        bio: "I am a secret agent too",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "john",
        fullName: "John Doe",
        dob: "1980-04-01",
        email: "john@gmail.com",
        password: "password",
        bio: "I am a random person",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "jill",
        fullName: "Jill Smith",
        dob: "1990-11-12",
        email: "jill@gmail.com",
        password: "password",
        bio: "My name is Jill",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "Freddy",
        fullName: "Freddy Kruger",
        dob: "1980-04-01",
        email: "freddy@gmail.com",
        password: "password",
        bio: "I am another random person",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
