'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(models.Test, {as: 'Tests'})
      User.hasMany(models.Assignment)
      User.hasMany(models.Submission)
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