import { server as WebSocketServer } from 'webSocket';
import { gid } from './utils/helper.js';

const clients = {};
const rooms = {};

export const setupWebSocket = (httpServer) => {
    const wsServer = new WebSocketServer({ httpServer });

    wsServer.on('request', (request) => {
        const connection = request.accept(null, request.origin);

        connection.on('open', () => console.log('Connection opened'));
        connection.on('close', () => console.log('Connection closed'));
        connection.on('message', (message) => {
            const receivedData = JSON.parse(message.utf8Data);

            if (receivedData.method === 'create') {
                handleCreateRoom(receivedData);
            }

            if (receivedData.method === 'join') {
                handleJoinRoom(receivedData);
            }
        });

        const clientId = gid();
        clients[clientId] = { connection };

        const payload = {
            method: 'connect',
            id: clientId,
        };

        connection.send(JSON.stringify(payload));
    });
};

const handleCreateRoom = (receivedData) => {
    const clientId = receivedData.id;
    const roomId = gid();

    rooms[roomId] = {
        id: roomId,
        owner: clientId,
        clients: [{ id: clientId }],
    };

    const payload = {
        method: 'create',
        room_id: roomId,
    };

    const connection = clients[clientId].connection;
    connection.send(JSON.stringify(payload));
};

const handleJoinRoom = (receivedData) => {
    const clientId = receivedData.id;
    const roomId = receivedData.room_id;
    const room = rooms[roomId];

    if (room.clients.length === 2) {
        return; 
    }

    room.clients.push({ id: clientId });

    const payload = {
        method: 'join',
        room_data: room,
    };

    const connection = clients[clientId].connection;
    connection.send(JSON.stringify(payload));
};
