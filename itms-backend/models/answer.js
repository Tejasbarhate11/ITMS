'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    
    static associate(models) {
      Answer.belongsTo(models.Question);
    }
  };
  
  Answer.init({
    correct: DataTypes.JSON
  }, 
  {
    underscored: true,
    sequelize,
    modelName: 'Answer',
    updatedAt: false,
    createdAt: false
  });
  return Answer;
};