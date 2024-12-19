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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
  

function PopupModal({ children }: { children: React.ReactNode }) {
 
    const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(7);
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (!roomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }
    navigate(`/room/${roomId}`);
  };

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
              value={roomId}
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