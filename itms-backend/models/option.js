'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Option.belongsTo(models.Question)
    }
  };
  Option.init({
    option_body: {
      type: DataTypes.TEXT,
      allowNull: false
    } 
  }, 
  {
    underscored: true,
    sequelize,
    modelName: 'Option',
    updatedAt: false,
    createdAt: false
  });
  return Option;
};