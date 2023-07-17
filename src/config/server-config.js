const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path : path.resolve(__dirname , '../../.env')});

// console.log(process.env) 

module.exports = {
    "PORT" : process.env.PORT,
    "FLIGHT_SERVICE" : process.env.FLIGHT_SERVICE,
    "QUEUE_NAME" : process.env.QUEUE_NAME
}