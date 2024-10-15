import express, { json } from "express"
import http from "http"
import { server as websocketServer } from "webSocket"
const app = express();
const httpserver = http.createServer(app) 
const PORT = 4444 || process.env.PORT
httpserver.listen(PORT, () => {
    console.log(`listenting to port " ${PORT}`);
})

const clients = {}
const rooms = {}
const wsserver = new websocketServer({
    "httpServer": httpserver
})

wsserver.on("request", request => {
    const connection = request.accept(null, request.origin);
    connection.on('open', () => console.log("connection opened"));
    connection.on("close", () => console.log("connection closed"));
    connection.on("message", message => {
        const recieved_data = JSON.parse(message.utf8Data);
        
        if(recieved_data.method === "create"){
            const recieved_client_id  = recieved_data.id;
            const room_id = gid()
            rooms[room_id]={
                "id":room_id,
                "owner":recieved_client_id,
                "clients":[]
            }
            const client_data = {
                "id":recieved_client_id
            }
            rooms[room_id].clients.push(client_data)

            const payload = {
                "method":"create",
                "room_id":room_id
            }

            const con = clients[recieved_client_id].connection
            con.send(JSON.stringify(payload))
            
        }

        if(recieved_data.method === "join"){
            const recieved_client_id = recieved_data.id;
            const recieved_room_id = recieved_data.room_id;
            const room = rooms[recieved_room_id];
            if (room.clients.length == 2){
                return
            }
            const client_data = {
                "id":recieved_client_id
            }
            room.clients.push(client_data)

const payload = {
    "method":"join",
    "room_data":rooms[recieved_room_id]
}

const con = clients[recieved_client_id].connection
con.send(JSON.stringify(payload))
        }

    })

    const client_id = gid()
    clients[client_id] = {
        "connection":connection
    }
    
    const payload = {
        "method":"connect",
        "id":client_id
    }
    
    connection.send(JSON.stringify(payload))
    
})


const s4 = () =>{
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
}
const gid = ()=>(s4()+"-"+s4()+"-"+s4()+"-4"+s4().substring(1))





