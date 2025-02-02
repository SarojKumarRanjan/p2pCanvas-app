import { WebSocketServer } from "ws"
import { User } from "./classes/user.js";





export const setupWebSocket = (httpServer : any) => {

    const wss = new WebSocketServer({ server : httpServer });

    wss.on('connection', function connection(ws) {
        let user = new User(ws)



        const initialdelay = setTimeout(() => {
            const payload = {
                "method": "connect",
                "id": user.getid()
            }

            ws.send(JSON.stringify(payload))
        }, 1000)

        ws.on('error', console.error);
        ws.on('close', function message(data) {
            user.destroy()
            clearTimeout(initialdelay)
        });

    });


}





