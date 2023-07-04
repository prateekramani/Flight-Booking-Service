const { StatusCodes } = require("http-status-codes");
const CrudRepository = require("./crud-repository");
const { Booking } = require("../models");
const AppError = require("../utils/errors/app-error")


class BookingRepository extends CrudRepository {

    constructor() {
        super(Booking);
    }

    async createBooking(data, transaction) {
        const response = await this.model.create(data, { transaction: transaction });
        return response;
    }

    async get(data, transaction) {
        const response = await Booking.findByPk(data, {transaction: transaction});
        if (!response) {
            throw new AppError("Not able to find the resource", StatusCodes.INTERNAL_SERVER_ERROR);
        }
        return response;
    }


    async update(id , data, transaction) {
        const response = await this.model.update(data , {
            where : {
                id : id
            }
        }, { transaction: transaction })
        return response;
    }

}

module.exports = BookingRepository