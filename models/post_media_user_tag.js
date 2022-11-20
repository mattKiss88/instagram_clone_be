"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post_media_user_tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Post_media_user_tag.init(
    {
      postMediaId: DataTypes.NUMBER,
      userId: DataTypes.NUMBER,
      x_coordinate: DataTypes.NUMBER,
      y_coordinate: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Post_media_user_tag",
    }
  );
  return Post_media_user_tag;
};
