const amqplib = require("amqplib")
const { QUEUE_NAME } = require("./server-config")

let channel , connection ;

async function connectQueue() {
    try {
        connection = await amqplib.connect("amqp://localhost");
        channel = await connection.createChannel();
        await channel.assertQueue("noti-queue");
        console.log("Queue Connected !!");
       
    } catch (error) {
        console.log(error);
    }
}


async function sendData(data) {
    try {
         // setInterval(async () => {
        await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)));
        // }, 1000);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    connectQueue,
    sendData
}