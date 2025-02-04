import { toast } from "sonner";
import { WebSocketMessage } from "@/types/WebSocketTypes";



export class WebSocketService {
    private static instance: WebSocketService;
    private webSocket : WebSocket | null = null;

    // private constructor to prevent multiple instances of the class


    private constructor() {
       
    }


    // initiate the websocket connection
    public static getInstance(): WebSocketService {
        if (!this.instance) {
            this.instance = new WebSocketService();
        }

        return this.instance;
    }

    //webSocket connection 

    public connect (url: string):Promise<WebSocket> {
        return new Promise((resolve,reject) => {

            if(this.webSocket){
                console.warn("WebSocket already connected");
                return;
            }

            this.webSocket = new WebSocket(url);

            this.webSocket.onopen = () => {
                toast.success("WebSocket connected");
                resolve(this.webSocket!);
            };

            this.webSocket.onclose = () => {
                toast.error("WebSocket disconnected");
                this.webSocket = null;
            };

            this.webSocket.onerror = (error: Event) => {
                toast.error("WebSocket error");
                console.error("WebSocket error", error);
                reject(error);
            };

        })      
    }


    // send message to the websocket server

    public send(message: WebSocketMessage): void {
        if(!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN){
            console.warn("WebSocket not connected");
            return;
        }

        this.webSocket.send(JSON.stringify(message));
    }


    // close the websocket connection

    public disconnect(): void {
        if(this.webSocket){
            this.webSocket.close();
        }
        this.webSocket = null;
    }

    public getWebSocket(): WebSocket | null {
        return this.webSocket;
    }

}