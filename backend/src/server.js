

import http from 'http';
import app from './app.js';
import { setupWebSocket } from './websocket.js';

const PORT = process.env.PORT || 4444;
const httpServer = http.createServer(app);

setupWebSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});


