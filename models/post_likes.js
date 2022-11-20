'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post_likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Post_likes.init({
    userId: DataTypes.NUMBER,
    postId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Post_likes',
  });
  return Post_likes;
};