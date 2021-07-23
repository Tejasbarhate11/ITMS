'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Test.belongsTo(models.User);
      Test.belongsTo(models.Designation);
      Test.belongsTo(models.Department);
      Test.belongsToMany(models.Question, { through: models.TestQuestion });
      Test.hasMany(models.Assignment)
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