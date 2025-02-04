import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Button } from "../ui/button"
  import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WebSocketService } from "@/services/WebSocketService";
import { useAppContext } from "@/context/AppContext";

  

function PopupModal({ children }: { children: React.ReactNode }) {

  const {setWs,client_id,setClientId,room_id,setRoomId} = useAppContext();
 
    const navigate = useNavigate();

    const webSocketService = WebSocketService.getInstance();

    useEffect(() => {
      const initializedWebsocket = async () => {
        try {
          const websocket = await webSocketService.connect("ws://localhost:4444");
          setWs(websocket);

          websocket.onmessage = (event) => {
            const message = JSON.parse(event.data) ;
            switch (message.method) {
              case "connect":
                setClientId(message.id);
                console.log("Connected to websocket server "+message.id);
                
                break;
              case "create":
                console.log(message.room_id);
                
                setRoomId(message.room_id);
                navigate(`/room/${message.room_id}`);
                break;
              case "join":
                navigate(`/room/${message.room_data.id}`);
                break;
              case "error":
                toast.error(message.message);
                break;
              default:
                break;
            }
          }


          
        } catch (error) {
          toast.error("Error initializing websocket");
          console.error("Error initializing websocket", error);
          
        }
      }

      initializedWebsocket();


    


    },[])

    const joinRoom = () => {
      if(room_id){
        webSocketService.send({
          method: "join",
          id: client_id,
          room_id: room_id
        })
      } else {
        toast.error("Please enter a room ID");
      }
    }


    const createRoom = () => {
      webSocketService.send({
        "method": "create",
        "id": client_id
      })
    }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join or Create a Room</DialogTitle>
            <DialogDescription>
                Enter a room ID to join or create a new room
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-6">
            <Label htmlFor="roomId">Room ID</Label>
            <Input
              id="roomId"
              value={room_id}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID to join"
            />
          </div>
          <div className="flex gap-5">
            <Button
              onClick={joinRoom}
              className="flex-1"
            >
              Join Room
            </Button>
            <Button onClick={createRoom} variant="outline" className="flex-1">
              Create New Room
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


export default PopupModal