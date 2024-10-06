'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('walletTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sourceReference: {
        type: Sequelize.STRING
      },
      destinationReference: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL(18, 4)
      },
      narration: {
        type: Sequelize.STRING
      },
      transactionType: {
        type: Sequelize.ENUM('0', '1', '2')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('walletTransactions');
  }
};