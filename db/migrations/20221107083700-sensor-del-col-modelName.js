/**
 * @typedef {import('sequelize').queryInterface} queryInterface
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('weather', 'sensorIds', {
      type: Sequelize.INTEGER,
    });

    await queryInterface.sequelize.query(
      'UPDATE weather SET sensorIds = `weather`.`sensorId`',
    );

    await queryInterface.changeColumn(
      'sensor',
      'model',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'SensorModel',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );

    await queryInterface.sequelize.query(
      'UPDATE weather SET sensorId = `weather`.`sensorIds`',
    );

    await queryInterface.removeColumn('weather', 'sensorIds');
  },
  async down(queryInterface, Sequelize) { },
};
