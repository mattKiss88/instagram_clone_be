"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Post_media", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      postId: {
        type: Sequelize.INTEGER,
        required: true,
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      filterId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Filters",
          key: "id",
        },
      },
      mediaFileId: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
        required: true,
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
    await queryInterface.dropTable("Post_media");
  },
};
