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
  }, {
    sequelize,
    modelName: 'weather',
    paranoid: true,
  });

  return Weather;
};