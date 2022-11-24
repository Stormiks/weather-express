/**
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('SensorModel')} SensorModel
 */

const {
  Model,
} = require('sequelize');

/**
 * @class SensorModel
 * @module SensorModel
 */
class SensorModel extends Model {
  static associate(models) {
  }
}

/**
 * @module SensorModel
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  SensorModel.init({
    modelName: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'SensorModel',
    tableName: 'sensorModel',
  });
  return SensorModel;
};
