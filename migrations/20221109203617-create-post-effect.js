"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Post_effects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      post_media_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Post_media",
          key: "id",
        },
      },
      effectId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Effects",
          key: "id",
        },
      },
      scale: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Post_effects");
  },
};
