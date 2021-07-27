'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    
    static associate(models) {
        Assignment.belongsTo(models.Test)
        Assignment.belongsTo(models.User)
    }
  };
  Assignment.init({
    status: {
      type: DataTypes.ENUM('scheduled', 'started', 'not attempted', 'dropped', 'cancelled', 'completed'),
      defaultValue: 'scheduled'
    },
    notified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    opens_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    closes_at: {
      type: DataTypes.DATE,
      allowNull: false
    }   
  }, {
    underscored: true,
    sequelize,
    modelName: 'Assignment',
    updatedAt: false
  });
  return Assignment;
};