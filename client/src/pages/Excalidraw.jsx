import React, { useState ,useEffect} from 'react'
import { Excalidraw } from '@excalidraw/excalidraw';
import { useAppContext } from '../Mycontext';

const ExcalidrawCanvas = () => {

  const [excalidrawAPI1, setExcalidrawAPI1] = useState(null)
  const {Ws , setWs,client_id,setClient_id,room_id,setRoom_id} = useAppContext()
const [scene , setScene] = useState(null)
const [intervalId, setIntervalId] = useState(null);

 Ws.onmessage = (event) => {
    const newMessage = event.data;
    const parsedMessage = JSON.parse(newMessage)
  
    
    
    if (parsedMessage.method === "update") {
      const sceneData1 = parsedMessage.state
     
    if (sceneData1) {
       sceneData1.appState.collaborators = new Map(sceneData1.appState.collaborators);
   }
   
      if (sceneData1) {
        if (excalidrawAPI1) {
          
          
          excalidrawAPI1.updateScene(sceneData1);
          
      } 
      }
  
 
      
    }
  }

  
  const getSceneData = () => {
    if (excalidrawAPI1) {
        var currentElements = excalidrawAPI1.getSceneElements();
        var currentAppState = excalidrawAPI1.getAppState();
        

        
        currentAppState.collaborators = Array.from(currentAppState.collaborators.entries());

        
        
    }


    if (currentElements && currentAppState) {
        var sceneData2 = {
            elements: currentElements,
            appState: currentAppState,
        };
    }
   

    if (sceneData2) {
      const payload = {
        "method":"state",
        "state":sceneData2,
        "room_id":room_id,
        "owner":client_id
      }
   
      
     
      
    
    
       if (payload) {
         Ws.send(JSON.stringify(payload))
      
       }
      
    }
};

const handleMouseEnter = () => {
    
        const id = setInterval(() => {
        //     // console.log("Action running every 750 ms");
            getSceneData();
        }, 500);
        setIntervalId(id);
    
};

const handleMouseLeave = () => {
    if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
    }
};



  return (
    <>
    <div  onMouseEnter={handleMouseEnter}
     onMouseLeave={handleMouseLeave}  
     style={{ height: "500px", width: "500px", display: "inline-block" }}>
                <p style={{ fontSize: "16px" }}>Excalidraw 1</p>

                <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI1(api)} />
            </div>
            
    </>
  )
}

export default ExcalidrawCanvas