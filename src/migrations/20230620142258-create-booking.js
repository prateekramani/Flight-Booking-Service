'use strict';
/** @type {import('sequelize-cli').Migration} */
const { BOOKING_STATUS } = require("../utils/common/enum");
const { BOOKED, PENDING, CANCELLED, INITIATED } = BOOKING_STATUS
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        values: [BOOKED, PENDING, CANCELLED, INITIATED],
        defaultValue: INITIATED,
        allowNull: false
      },
      totalCost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      noOfSeats: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};