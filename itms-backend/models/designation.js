'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Designation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Designation.hasMany(models.Test, {as: 'Tests'})
    }
  };
  Designation.init({
    designation: {
      type: DataTypes.STRING(100)
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    underscored: true,
    sequelize,
    modelName: 'Designation',
    updatedAt: false
  });
  return Designation;
};