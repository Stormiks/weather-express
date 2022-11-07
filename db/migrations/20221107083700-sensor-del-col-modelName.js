/**
 * @typedef {import('sequelize').queryInterface} queryInterface
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'sensor',
      'model',
      {
        type: Sequelize.STRING,
      },
    );

    await queryInterface.addColumn(
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'sensor',
      'model',
    );
  },
};
