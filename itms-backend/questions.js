'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Question.init({
    type: {
      type: DataTypes.STRING(10)
    },
    score: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ''
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    alternatives: {
      type: DataTypes.STR,
      allowNull: false,
      defaultValue: ''
    },
    time_limit: {
      type: DataTypes.INTEGER
    },
    keywords: {
      type: DataTypes.TEXT
    },
    deleted_at: {
      type: DataTypes.DATE,
      defaultValue: null
    }
  }, {
    underscored: true,
    sequelize,
    modelName: 'Question',
    updatedAt: false
  });
  return Question;
};