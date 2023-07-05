

const { BookingService } = require ("../services")
const { successResponse , errorResponse} = require("../utils/common")
const {StatusCodes} = require("http-status-codes"); 
const inMemoryDB = {}


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


async function makePayment(req, res) {
    try {
        const idempotencyKey = req.headers["x-idempotency-key"]
        if (!idempotencyKey || inMemoryDB[idempotencyKey] ) {
            if (!idempotencyKey){
                return res.status(StatusCodes.BAD_REQUEST).json({message : "Idempotency Key is missing"});    
            }
            return res.status(StatusCodes.BAD_REQUEST).json({message : "Cannot retry on a succesful payment"});
        }
        const response = await BookingService.makePayment({
            userId : req.body.userId,
            bookingId : req.body.bookingId,
            totalCost : req.body.totalCost 
        })
        successResponse.msg = "Successfully done Payment";
        successResponse.data = response;
        inMemoryDB[idempotencyKey] = idempotencyKey ;
        return res.status(StatusCodes.CREATED).json(successResponse);

    } catch (error) {
        console.log(error)
        errorResponse.msg = "Something went wrong while making Payment";
        errorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }

}

module.exports = {
    createBooking,
    makePayment
}