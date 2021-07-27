'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Submission.belongsTo(models.User);
      Submission.belongsTo(models.Test);
    }
  };

  Submission.init({
    response: {
      type: DataTypes.JSON,
      allowNull: false
    },
    submitted_on: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    status: {
      type: DataTypes.ENUM('unevaluated', 'evaluated'),
      allowNull: false,
      defaultValue: 'unevaluated'
    }
  },{
    underscored: true,
    sequelize,
    modelName: 'Submission',
    updatedAt: false,
    createdAt: false
  });
  return Submission;
};