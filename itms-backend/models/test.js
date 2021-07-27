'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test extends Model {

    static associate(models) {
      Test.belongsTo(models.User);
      Test.belongsTo(models.Designation);
      Test.belongsTo(models.Department);
      Test.belongsToMany(models.Question, { through: models.TestQuestion });
      Test.hasMany(models.Assignment)
      Test.hasMany(models.Submission)
    }
  };
  Test.init({
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    instructions: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    total_score: DataTypes.INTEGER,
    time_limit: DataTypes.INTEGER,
    deleted_at: DataTypes.DATE   
  }, {
    underscored: true,
    sequelize,
    modelName: 'Test',
  });
  return Test;
};