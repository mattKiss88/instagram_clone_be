"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: "createdByUserId",
        as: "createdByUser",
      });
      Comment.belongsTo(models.Post, {
        foreignKey: "postId",
        as: "post",
      });
    }
  }
  Comment.init(
    {
      createdByUserId: DataTypes.NUMBER,
      postId: DataTypes.NUMBER,
      comment: DataTypes.STRING,
      commentRepliedToId: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
