'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    
    static associate(models) {
        Question.hasMany(models.Option, { as: 'Options' });
        Question.belongsToMany(models.Test, { through: models.TestQuestion });
    }
  };
  Question.init({
    type: DataTypes.STRING(25),
    question_body: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    total_score:{ 
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    time_limit: { 
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    keywords: DataTypes.STRING
  }, 
  {
    underscored: true,
    sequelize,
    modelName: 'Question',
    updatedAt: false,
    createdAt: false
  });
  return Question;
};