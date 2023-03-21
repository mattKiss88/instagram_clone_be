"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Filter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Filter.init(
    {
      filterName: DataTypes.STRING,
      filterDetails: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Filter",
    }
  );

  Filter.removeAttribute("updatedAt");
  Filter.removeAttribute("createdAt");

  return Filter;
};
