"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post_effect extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Post_effect.init(
    {
      post_media_id: DataTypes.NUMBER,
      effectId: DataTypes.NUMBER,
      scale: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Post_effect",
    }
  );
  return Post_effect;
};
