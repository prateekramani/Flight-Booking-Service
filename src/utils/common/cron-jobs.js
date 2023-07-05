

var cron = require('node-cron');
const { BookingService } = require("../../services")
 

async function scheduleCrons() {
    cron.schedule('*/5 * * * *',async () => {
      console.log("crons executed")
      const response = await BookingService.cancelOldBookings() ;
      // console.log(response);
      });
   
}


module.exports = scheduleCrons;
