"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.hasOne(models.Profile_picture, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      dob: DataTypes.STRING,
      bio: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
  ß;
};
