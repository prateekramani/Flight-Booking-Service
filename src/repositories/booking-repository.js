const { StatusCodes } = require("http-status-codes");
const CrudRepository = require("./crud-repository");
const { Booking } = require("../models");
const AppError = require("../utils/errors/app-error");
const { Op } = require("sequelize");
const { Enums } = require("../utils/common")
const { CANCELLED, BOOKED } = Enums.BOOKING_STATUS


class BookingRepository extends CrudRepository {

    constructor() {
        super(Booking);
    }

    async createBooking(data, transaction) {
        const response = await this.model.create(data, { transaction: transaction });
        return response;
    }

    async get(data, transaction) {
        const response = await Booking.findByPk(data, { transaction: transaction });
        if (!response) {
            throw new AppError("Not able to find the resource", StatusCodes.INTERNAL_SERVER_ERROR);
        }
        return response;
    }


    async update(id, data, transaction) {
        const response = await this.model.update(data, {
            where: {
                id: id
            }
        }, { transaction: transaction })
        return response;
    }


    async cancelOldBookings(timestamp) {
        const response = await this.model.update({ status: CANCELLED }, {
            where: {
                [Op.and]: [
                    {
                        createdAt: {
                            [Op.lte]: timestamp
                        }
                    },
                    {
                        status: {
                            [Op.ne]: BOOKED
                        }
                    }
                ]
            }
        });

        return response;
    }

}

module.exports = BookingRepository