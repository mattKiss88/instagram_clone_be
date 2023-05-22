"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post_likes extends Model {
    static associate(models) {
      Post_likes.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Post_likes.init(
    {
      userId: DataTypes.NUMBER,
      postId: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Post_likes",
    }
  );
  return Post_likes;
};
