"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment_likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comment_likes.init(
    {
      userId: DataTypes.NUMBER,
      commentId: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Comment_likes",
    }
  );
  return Comment_likes;
};
