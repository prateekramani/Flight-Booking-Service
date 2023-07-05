


const axios = require("axios");
const { ServerConfig } = require("../config")
const { BookingRepository } = require("../repositories");
const db = require("../models");
const AppError = require("../../../Flight-Service/src/utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { BOOKING_STATUS } = require("../utils/common/enum");
const { BOOKED, CANCELLED } = BOOKING_STATUS;

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

async function makePayment(data) {

    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingrepository.get(data.bookingId, transaction)

        if (bookingDetails.status == CANCELLED) {
            throw new AppError("The Booking has expired !!", StatusCodes.BAD_REQUEST);
        }

        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();

        if (currentTime - bookingTime > 300000) {
            await cancelBooking(data);
            throw new AppError("The Booking has expired !!", StatusCodes.BAD_REQUEST);
        }
        if (bookingDetails.totalCost != data.totalCost) {
            throw new AppError("The Amount of the payment dosen't match !!", StatusCodes.BAD_REQUEST);
        }
        if (bookingDetails.userId != data.userId) {
            throw new AppError("The User correspoding to the booking dosen't match !!", StatusCodes.BAD_REQUEST);
        }

        // we assume that payement is successful

        await bookingrepository.update(data.bookingId, { status: BOOKED }, transaction);

        await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelBooking(data) {
    const transaction = await db.sequelize.transaction();

    try {
        const bookingDetails = await bookingrepository.get(data.bookingId, transaction);
        if (bookingDetails.status == CANCELLED) {
            await transaction.commit();
            return true;
        }
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
            seats: bookingDetails.noOfSeats,
            dec: 0
        });
        const response = await bookingrepository.update(data.bookingId, { status: CANCELLED }, transaction);
        console.log(response);
        transaction.commit();

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}


async function cancelOldBookings() {
    const time = new Date(Date.now() - 1000 * 300); // 5 mins ago time
    const response = await bookingrepository.cancelOldBookings(time)
    return response;
}

module.exports = {
    createBooking,
    makePayment,
    cancelBooking,
    cancelOldBookings
}