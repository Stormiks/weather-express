/**
 * @typedef {import('sequelize').queryInterface} queryInterface
 * @typedef {import('sequelize').Sequelize} Sequelize
 */

module.exports = {
  /**
   * @param {queryInterface}
   * @param {Sequelize}
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('weather', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      temperature: {
        type: Sequelize.REAL,
      },
      humidity: {
        type: Sequelize.REAL,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('weather');
  },
};
