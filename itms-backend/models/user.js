'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Test, {as: 'Tests'})
      User.hasMany(models.Assignment)
    }
  };
  User.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ''
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ''
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    mobile_no: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: ''
    },
    role: {
      type: DataTypes.ENUM('admin', 'examinee'),
      allowNull: false,
      defaultValue: 'examinee'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    },
    deleted_at: {
      type: DataTypes.DATE,
      defaultValue: null
    }
  }, {
    underscored: true,
    sequelize,
    modelName: 'User',
    updatedAt: false
  });
  return User;
};