import http from 'http';
import app from './app.js';
import { setupWebSocket } from '../src/websocket.js';

const PORT = process.env.PORT || 4444;
const httpServer = http.createServer(app);

// websocket setup it will be in a separate file 
//it is function in which we pass the httpserver after that all the websocket logic will be handled by this function
setupWebSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
