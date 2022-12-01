/**
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('Sensor')} Sensor
 */

const {
  Model,
} = require('sequelize');

/**
 * @class Sensor
 * @module Sensor
 */
class Sensor extends Model {}

/**
 * @module Sensor
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  Sensor.init({
    deviceId: DataTypes.STRING,
    serialNumber: DataTypes.STRING,
    manufacturerId: DataTypes.STRING,
    model: {
      type: DataTypes.INTEGER,
      references: {
        model: 'SensorModel',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Sensor',
    tableName: 'sensor',
    paranoid: true,
  });
  return Sensor;
};
