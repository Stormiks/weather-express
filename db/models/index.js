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

/**
  * @type Weather
  * @namespace Weather
  * @property {DataTypes} Weather.humidity
  * @property {DataTypes} Weather.temperature
  * @method findAll
  * @method findOne
  * @method findByPk
  * @method create
  * @returns {this.Weather} Weather model
  */
// eslint-disable-next-line import/extensions
const Weather = require('./weather.js')(sequelize, Sequelize.DataTypes);

// fs
//   .readdirSync(__dirname)
//   .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

module.exports = { Weather, sequelize, Sequelize };
