"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile_picture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile_picture.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Profile_picture.init(
    {
      mediaFileId: DataTypes.STRING,
      userId: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Profile_picture",
    }
  );
  return Profile_picture;
};
