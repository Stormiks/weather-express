/**
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('Weather')} Weather
 */

const {
  Model,
} = require('sequelize');

/**
 * @class Weather
 * @module Weather
 */
class Weather extends Model {}

/**
 * @module Weather
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  Weather.init({
    temperature: DataTypes.REAL,
    humidity: DataTypes.REAL,
    sensorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Sensor',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Weather',
    tableName: 'weather',
    paranoid: true,
  });

  return Weather;
};
