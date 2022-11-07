/**
 * @typedef {import('./weather.js').Weather} Weather
 */
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

/**
 * Returns the models database
 * @returns {object} { comment, task, seeders }
 */
// const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const Weather = require('./weather.js')(sequelize, Sequelize.DataTypes);
const Sensor = require('./sensor.js')(sequelize, Sequelize.DataTypes);
const SensorModel = require('./sensormodel.js')(sequelize, Sequelize.DataTypes);

Sensor.hasMany(Weather, { onDelete: 'cascade' });

Sensor.hasOne(SensorModel);
SensorModel.hasMany(Sensor, {
  foreignKey: 'model',
  constraints: false, // fix: Cyclic dependency found. documents is dependent of itself.
});

module.exports = {
  Weather,
  Sensor,
  SensorModel,
  sequelize,
  Sequelize,
};
