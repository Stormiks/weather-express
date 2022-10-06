/**
 * @typedef {import('sequelize').queryInterface} queryInterface
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'weather',
      'sensorId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Sensor',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'weather',
      'sensorId',
    );
  },
};
