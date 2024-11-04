import { createContext,useContext,useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext({})

export const AppContextProvider = ({children}) =>{

    const [Ws, setWs] = useState("")
    const [client_id, setClient_id] = useState("")
    const [room_id, setRoom_id] = useState("")
   

    return <AppContext.Provider value={{Ws,setWs,client_id,setClient_id,room_id,setRoom_id}}>
        {children}
        </AppContext.Provider>
}

export const useAppContext = ()=>{
    const checkedContext = useContext(AppContext)
    if(!checkedContext){
        console.log("component is not under this context");
        
    }
    return checkedContext
}