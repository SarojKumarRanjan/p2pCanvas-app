import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../Mycontext'




const Home = () => {


const {Ws , setWs,client_id,setClient_id,room_id,setRoom_id} = useAppContext()

const navigate = useNavigate()

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:4444');
    setWs(websocket);
    websocket.onopen = () => {
      console.log('WebSocket connection established');
      
    };

    

    websocket.onmessage = (event) => {
      const newMessage = event.data;
      const parsedMessage = JSON.parse(newMessage)
      if (parsedMessage.method === "connect") {
        setClient_id(parsedMessage.id);
        console.log(parsedMessage.id);
      }

      if (parsedMessage.method === "create") {
        setRoom_id(parsedMessage.room_id);
        console.log(parsedMessage?.room_id);
        navigate(`/draw/${parsedMessage?.room_id}`)
      }

      if (parsedMessage.method === "join") {
        console.log(parsedMessage?.room_data?.id);
        navigate(`/draw/${parsedMessage?.room_data?.id}`)
      }


    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    
  }, [])

  const createRoom = () => {
    const payload = {
      "method": "create",
      "id": client_id
    }
    Ws.send(JSON.stringify(payload))
  }

  const joinRoom = () => {
    const payload = {
      "method": "join",
      "id": client_id,
      "room_id": room_id
    }
    Ws.send(JSON.stringify(payload))
  }

  return (
    <>
      <div>home</div>
      <div>{true && `${client_id}`}</div>
      <div>{true && `${room_id}`}</div>
      <div><input type="text" placeholder='enter id'
        onChange={(e) => setRoom_id(e.target.value)} /></div>
      <button onClick={createRoom}>create</button>
      <button onClick={joinRoom}>join</button>
    </>
  )
}

export default Home