import express from "express"
import http from "http"
import { server as websocketServer } from "webSocket"
const app = express();
const httpserver = http.createServer(app) 
const PORT = 4444 || process.env.PORT
httpserver.listen(PORT, () => {
    console.log(`listenting to port " ${PORT}`);
})


const wsserver = new websocketServer({
    "httpServer": httpserver
})

wsserver.on("request", request => {
    const connection = request.accept(null, request.origin);
    connection.on('open', () => console.log("connection opened"));
    connection.on("close", () => console.log("connection closed"));
    connection.on("message", message => {
        // const recieved_data = JSON.parse(message.utf8Data);
        console.log(message.utf8Data);

    })
})



