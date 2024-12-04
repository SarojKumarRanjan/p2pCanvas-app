import { server as WebSocketServer } from 'webSocket';
import { gid } from './utils/helper.js';

const clients = {}
const rooms = {}
const room_state = {
    "state": ""
}

export const setupWebSocket = (httpServer) => {
    const wsServer = new WebSocketServer({ httpServer });

    wsServer.on('request', (request) => {
        let cond = true;
        const connection = request.accept(null, request.origin);

        connection.on('open', () => console.log('Connection opened'));
        connection.on('close', () => console.log('Connection closed'));
        connection.on('message', (message) => {
            const receivedData = JSON.parse(message.utf8Data);

            if (receivedData.method === 'create') {
                handleCreateRoom(receivedData);
            }

            if (receivedData.method === 'join') {
                handleJoinRoom(receivedData,cond);
            }

            if (receivedData.method === "state") {
                handleStateData(receivedData);
            }

            if (receivedData.method === "offer") {
                handleReceivedOffer(receivedData);
            }
    
            if (receivedData.method === "answer") {
                handleReceivedAnswer(receivedData);
            }

            if (receivedData.method === "ice-candidate") {
                handleReceievedCandidate(receivedData);
            }



        });

        const client_id = gid()
        clients[client_id] = {
            "connection": connection
        }
    
        const payload = {
            "method": "connect",
            "id": client_id
        }
    
        connection.send(JSON.stringify(payload))
    });
};

const handleCreateRoom = (received_Data) => {
    const recieved_client_id = received_Data.id;
    const room_id = gid()
    rooms[room_id] = {
        "id": room_id,
        "owner": recieved_client_id,
        "client": [],
        "state_data": {
            "owner": "",
            "state": ""
        },
        "length": ""


    }
    const client_data = {
        "id": recieved_client_id
    }
    rooms[room_id].client.push(client_data)

    const payload = {
        "method": "create",
        "room_id": room_id
    }

    const con = clients[recieved_client_id].connection
    con.send(JSON.stringify(payload))

};

const handleJoinRoom = (received_Data,cond) => {
    const recieved_client_id = received_Data.id;
            const recieved_room_id = received_Data.room_id;
            const room = rooms[recieved_room_id];


            if (room.client.length >= 6) {
                return console.log("not able to join");

            }

       
              
                const client_data = {
                    "id": recieved_client_id
                }
                room.client.push(client_data)

            if (rooms[recieved_room_id]?.client?.length > 1) updateRoomState(recieved_room_id,cond)
                
                
            const payload = {
                "method": "join",
                "room_data": rooms[recieved_room_id]
            }

 const id_data = room.client.filter(element=>element.id!== recieved_client_id)
 
                const payload_for_join = {
                    "method" : "user_joined",
                    "joined_user_id": id_data
                }
            const con = clients[recieved_client_id].connection
            con.send(JSON.stringify(payload))
            
       

            setTimeout(() => {
                const conn = clients[recieved_client_id].connection
            conn.send(JSON.stringify(payload_for_join))
              }, 1000);
            
};

const handleStateData = (received_Data) => {
    const room_id = received_Data.room_id;
    const state = received_Data.state;
    const owner = received_Data.owner;
    rooms[room_id].state_data.state = state;
    rooms[room_id].state_data.owner = owner;

};

const handleReceivedOffer = (received_Data) => {
    const id_to_send = received_Data.target
    const sdp = received_Data.sdp
    const caller = received_Data.caller
    const payload = {
        "method": "offer",
        sdp,
        caller
    }
    const con = clients[id_to_send].connection;
    con.send(JSON.stringify(payload))
};

const handleReceivedAnswer = (received_Data) => {
    const id_to_send = received_Data.target;
    const sdp = received_Data.sdp;
    const payload = {
        "method": "answer",
        sdp
    }
    const con = clients[id_to_send].connection;
    con.send(JSON.stringify(payload))

};

const handleReceievedCandidate = (received_Data) => {

    if (received_Data) {
        const id_to_send = received_Data.target
        const candidate = received_Data.candidate


        console.log(id_to_send);



        const payload = {
            "method": "ice-candidate",
            candidate
        }
        if (payload) {
            const con = clients[id_to_send].connection;
            con.send(JSON.stringify(payload))
        }
    }

};

const updateRoomState = (room_id,cond) => {

    if (cond == true) {

        room_state[room_id] = {
            "state": rooms[room_id].state_data.state
        }
        console.log("value of cond for first time" + cond);

        
        
        if (rooms[room_id].state_data) {
            const payload = {
                "method": "update",
                "room_id": room_id,
                "state": rooms[room_id]?.state_data?.state
            }



            if (Array.isArray(rooms[room_id].client)) {
                // console.log("updating state from backend ");

                rooms[room_id].client.filter(client_id => client_id.id !== rooms[room_id]?.state_data?.owner).forEach(client_id => {

                    clients[client_id.id].connection.send(JSON.stringify(payload))

                });

            }




        }
        cond = false
        console.log("value of cond for second time" + cond);
    }
    else {
        if (JSON.stringify(rooms[room_id].state_data.state) != JSON.stringify(room_state[room_id].state)) {
            if (rooms[room_id].state_data) {
                const payload = {
                    "method": "update",
                    "room_id": room_id,
                    "state": rooms[room_id]?.state_data?.state
                }


                console.log("value of cond for else time" + cond);

                if (Array.isArray(rooms[room_id].client)) {
                    // console.log("updating state from backend ");

                    rooms[room_id].client.filter(client_id => client_id.id !== rooms[room_id]?.state_data?.owner).forEach(client_id => {

                        clients[client_id.id].connection.send(JSON.stringify(payload))

                    });
                    room_state[room_id].state = rooms[room_id].state_data.state
                }




            }


        }
    }

    setTimeout(() => updateRoomState(room_id), 350);

}