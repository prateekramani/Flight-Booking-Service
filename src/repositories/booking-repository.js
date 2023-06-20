const { StatusCodes } = require("http-status-codes");
const CrudRepository = require("../../../Flight-Service/src/repositories/crud-repository");
const { Booking } = require("../models")


class BookingRepository extends CrudRepository {

    constructor() {
        super(Booking);
    }
}

module.exports = BookingRepository