

 import { User } from "./user"       
interface rooms{
    
    client : User[],
    stateData : {
        owner : string,
        state : object
    },
    length : number 
}

export class RoomManager {
    
roomData :Map<string ,rooms> = new Map()
roomState : Map<string,any> = new Map()
static instance : RoomManager
private constructor() {
   
}


public static getinstance(){
    if(!RoomManager.instance){
        RoomManager.instance = new RoomManager()
    }
    return RoomManager.instance
}

public findClient(room_id: string, id: string): User | null {
    const room = this.roomData.get(room_id);
    if (!room) {
        console.warn(`Room ${room_id} not found`);
        return null;
    }

    const user = room.client.find((c) => c.getid() === id);
    if (!user) {
        console.warn(`User ${id} not found in room ${room_id}`);
    }
    return user || null;
}

public addUser(roomId: string, user: User): void {
    let roomData = this.roomData.get(roomId);

    if (!roomData) {
      
        roomData = {
            client: [],
            stateData: { owner: "", state: {} },
            get length(){
                return this.client.length
            }
        };
        this.roomData.set(roomId, roomData);
    }

    roomData.client.push(user);

}

   
   public removeRoom(room_id: string): void {
    if (this.roomData.has(room_id)) {
        this.roomData.delete(room_id);
        console.log(`Room ${room_id} removed successfully`);
    } else {
        console.warn(`Room ${room_id} does not exist`);
    }
}
}




