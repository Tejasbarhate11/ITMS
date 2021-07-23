'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestQuestion extends Model {
    
    static associate(models) {
    }
  };
  TestQuestion.init({
      
  }, 
  {
    underscored: true,
    sequelize,
    modelName: 'TestQuestion',
    updatedAt: false,
    createdAt: false
  });
  return TestQuestion;
};