import { WebSocket } from "ws"
import {gid} from "../utils/helper.js"
import { RoomManager } from "./roomManager.js"
import { log } from "console"


export class User {

private id : string
private cond : boolean = true
private room_id! : string 

constructor(private ws :WebSocket){
this.id = gid()
this.initHandlers()
}

getid(){
    return this.id
}

initHandlers() {
    this.ws.on("message", async (data) => {
        const receivedData = JSON.parse(data.toString())
    
        
        switch (receivedData.method) {
           
                case "join":
                    
                    
                    this.handleJoinRoom(receivedData);
                break;
                case "who_joined":
                    
                    
                    this.handleuserJoinRoom();
                break;
              
               
                case "state":
                    
                    
                    this.handleStateData(receivedData);
                break;
                case "offer":
                    this.handleReceivedOffer(receivedData);
                break;
                case "answer":
                    this.handleReceivedAnswer(receivedData);
                break;
                case "ice-candidate":
                    this.handleReceievedCandidate(receivedData);
                break;
        
            default:
                break;
        }
    })
}

send(payload : any){
    if (payload) {
        this.ws.send(JSON.stringify(payload))
    }
}

destroy(){
   let roomData =  RoomManager.getinstance().roomData.get(this.room_id)
 
   
    if (roomData) {
        roomData.client = roomData?.client.filter(user=>user.id!==this.id)
    
    }
    
console.log(roomData);

    const payload = {
        "method":"user_left",
        "id":this.id
    }
      roomData?.client.forEach(client_id => {

        RoomManager.getinstance().findClient(this.room_id,client_id.id)?.send(payload)
           
        });
    
    if(roomData?.client.length === 0){
        console.log(roomData.client.length);
        
        RoomManager.getinstance().removeRoom(this.room_id)
    
    }
    
    // destroy webrtc too
}

// handleuserLeft(){
//     this.destroy()
// }

// handleCreateRoom (){
   
//     this.room_id = gid()
//     let owner = RoomManager.getinstance().roomData.get(this.room_id)?.owner
//     owner = this.id
//     RoomManager.getinstance().addUser(this.room_id,this)
  
    
  

//     const payload = {
//         "method": "create",
//         "room_id": this.room_id,
//     }

//     this.send(payload)

// };

handleJoinRoom (received_Data : any) {
    
  
   
    

this.room_id = received_Data.room_id
    if ((RoomManager.getinstance().roomData.get(this.room_id)?.client.length ?? 0) >= 6) {
        return console.log("not able to join");

    }

   
   RoomManager.getinstance().addUser(this.room_id, this) 

      


    if (RoomManager.getinstance().roomData.get(this.room_id)?.length ?? 0 > 1) this.updateRoomState(this.room_id,this.cond)
        console.log(RoomManager.getinstance().roomData.get(this.room_id)?.length);
        
        const room_data = RoomManager.getinstance().roomData.get(this.room_id)
    const payload = {
        "method": "join", 
        "room_data":{
            "id" : this.room_id
        }
    }
    
 
    
    this.send(payload)
   
    
    
};

handleuserJoinRoom(){
    const id_data = RoomManager.getinstance().roomData.get(this.room_id)?.client.filter(element=>element.id!== this.id).map(element => element.id)


        const payload_for_join = {
            "method" : "user_joined",
            "joined_user_id": id_data 
        }
       
       console.log(id_data);
       
        
    this.send(payload_for_join)
    
}

handleStateData(received_Data :any) {
    
    
    const state = received_Data.state;
    const data = RoomManager.getinstance().roomData.get(this.room_id)
    if (data&& data.stateData) {
        data.stateData.state  = state
        data.stateData.owner = this.id
    }
  
  

};

handleReceivedOffer(received_Data :any){
    const id_to_send = received_Data.target
    const sdp = received_Data.sdp
    const caller = received_Data.caller
    const payload = {
        "method": "offer",
        sdp,
        caller
    }
    const client = RoomManager.getinstance().findClient(this.room_id,id_to_send)
   client?.send(payload)
    
};

handleReceivedAnswer (received_Data:any) {
    const id_to_send = received_Data.target;
    const sdp = received_Data.sdp;
    const payload = {
        "method": "answer",
        sdp
    }
    const con = RoomManager.getinstance().findClient(this.room_id,id_to_send)
con?.send(payload)
};

handleReceievedCandidate (received_Data:any) {

    if (received_Data) {
        const id_to_send = received_Data.target
        const candidate = received_Data.candidate
        const payload = {
            "method": "ice-candidate",
            candidate
        }
        if (payload) {
            const con = RoomManager.getinstance().findClient(this.room_id,id_to_send)
            con?.send(payload)
        }
    }

};

updateRoomState(room_id: string, cond: boolean) {
    const requiredData = RoomManager.getinstance().roomData.get(room_id);
    if (!requiredData) {
        console.warn(`Room data not found for ${room_id}`);
        return;
    }

    // First-time broadcast buffer to ensure frontend catches it
    if (cond === true) {
        RoomManager.getinstance().roomState.set(room_id, requiredData.stateData?.state);

        const payload = {
            method: "update",
            state: requiredData.stateData?.state
        };

        if (Array.isArray(requiredData.client)) {
            // Repeat broadcast for 2.5 seconds (5 times every 500ms)
            let count = 0;
            const interval = setInterval(() => {
                if (count >= 5) {
                    clearInterval(interval);
                    return;
                }

                requiredData.client
                    .filter(client => client.id !== requiredData.stateData?.owner)
                    .forEach(client => {
                        RoomManager.getinstance().findClient(room_id, client.id)?.send(payload);
                    });

                count++;
            }, 500);
        }

        this.cond = false;
    } else {
        // Regular updates if state has changed
        if (
            JSON.stringify(requiredData.stateData?.state) !==
            JSON.stringify(RoomManager.getinstance().roomState.get(room_id))
        ) {
            const payload = {
                method: "update",
                room_id: room_id,
                state: requiredData.stateData?.state
            };

            if (Array.isArray(requiredData.client)) {
                requiredData.client
                    .filter(client => client.id !== requiredData.stateData?.owner)
                    .forEach(client => {
                        RoomManager.getinstance().findClient(room_id, client.id)?.send(payload);
                    });

                RoomManager.getinstance().roomState.set(room_id, requiredData.stateData.state);
            }
        }
    }

    // Re-check every 350ms
    setTimeout(() => this.updateRoomState(room_id, this.cond), 350);
}

}
















