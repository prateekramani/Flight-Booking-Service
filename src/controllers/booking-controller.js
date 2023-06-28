

const { BookingService } = require ("../services")
const { successResponse , errorResponse} = require("../utils/common")
const {StatusCodes} = require("http-status-codes"); 



// POST : / booking
// req body : { }

async function createBooking(req, res) {
    try {
        const booking = await BookingService.createBooking({
            flightId : req.body.flightId,
            userId : req.body.userId,
            status : req.body.status,
            totalCost : req.body.totalCost,
            noOfSeats : req.body.noOfSeats 
        })
        successResponse.msg = "Successfully created an Booking";
        successResponse.data = booking;
        return res.status(StatusCodes.CREATED).json(successResponse);

    } catch (error) {
        errorResponse.msg = "Something went wrong while creating Booking";
        errorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }

}

module.exports = {
    createBooking
}