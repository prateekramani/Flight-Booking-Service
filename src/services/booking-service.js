


const axios = require("axios");
const { ServerConfig } = require("../config")
const { BookingRepository } = require("../repositories");
const db = require("../models");
const AppError = require("../../../Flight-Service/src/utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");


const bookingrepository = new BookingRepository();

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data
        if (data.noOfSeats > flightData.totalSeats) {
            throw new AppError("Not enough seats available !!", StatusCodes.BAD_REQUEST);
        }

        const totalCost = flightData.price * data.noOfSeats;
        const bookingPayload = { ...data, totalCost: totalCost };
        const booking = await bookingrepository.createBooking(bookingPayload, transaction)

        const response = await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
            seats: data.noOfSeats
        })

        await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    createBooking
}