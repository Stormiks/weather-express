/**
 * @typedef {import('sequelize').queryInterface} queryInterface
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'sensor',
      'model',
      {
        type: Sequelize.STRING,
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
