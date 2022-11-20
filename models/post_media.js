"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post_media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Image.init(
    {
      postId: DataTypes.NUMBER,
      filterId: DataTypes.NUMBER,
      mediaFileId: DataTypes.STRING,
      position: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Image",
    }
  );
  return Post_media;
};
