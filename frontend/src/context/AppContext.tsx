/* eslint-disable react-refresh/only-export-components */
import { useState,useContext,createContext } from "react";


interface AppContextProps {
  room_id: string;
    setClientId: React.Dispatch<React.SetStateAction<string>>;
    client_id: string;
    setRoomId: React.Dispatch<React.SetStateAction<string>>;
    ws: WebSocket | null;
    setWs: React.Dispatch<React.SetStateAction<WebSocket | null>>;
    
  }
  
  const AppContext = createContext<AppContextProps | null>(null);

 


  export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [client_id, setClientId] = useState("");
    const [room_id, setRoomId] = useState("");
    const [ws, setWs] = useState<WebSocket | null>(null);
   
  
    return (
      <AppContext.Provider value={{ client_id, setClientId, room_id, setRoomId,ws,setWs}}>
        {children}
      </AppContext.Provider>
    );
  }


  export const useAppContext = ():AppContextProps => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error("useAppContext must be used within a AppContextProvider");
    }
    return context
  }