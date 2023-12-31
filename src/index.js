const express = require("express");
const {ServerConfig , Logger , QueueConfig } = require("./config"); 
// this will direclty fetch index.js file
// reason behind creating so many folders (controller , router, config) is that , we can direclty import all the files in respective index file and import it here 
// so that there are less import lines 
const apiRoutes = require("./routes")
const CRONS = require("./utils/common/cron-jobs")


const app = express();

app.use(express.json()) //this is going to add a middleware for all the upcoming routes 
app.use(express.urlencoded({extended : true })) // to read url endoded stuff in req bodu

app.use('/api' , apiRoutes);
app.use('/flightsService/api' , apiRoutes);


app.listen( ServerConfig.PORT , async ()=>{
    Logger.info("Successfully started the Flight Booking Service server on PORT", {});
    CRONS();
    await QueueConfig.connectQueue();
    // info is the level , Success....is the message 
    console.log( `Successfully started the Flight Booking Service server on PORT : ${ServerConfig.PORT}`)
})